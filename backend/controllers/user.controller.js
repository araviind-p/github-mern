import User from '../models/user.model.js'

export const getUserProfileAndRepos = async (req, res) => {

    const { username } = req.params
    try {
        const userRes = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                authorization: `token ${process.env.GITHUB_API_KEY}`
            }
        })

        if (!userRes.ok) {
            if (userRes.status === 404) {
                return res.status(404).json({ error: 'User not found' });
            }

        }

        const userProfile = await userRes.json()

        const repoRes = await fetch(userProfile.repos_url, {
            headers: {
                authorization: `token ${process.env.GITHUB_API_KEY}`
            }
        });
        const repos = await repoRes.json()

        res.status(200).json({ userProfile, repos })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const likeProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const authUser = await User.findById(req.user._id.toString());

        if (!authUser) {
            return res.status(404).json({ error: "Authenticated user not found" });
        }

        // Check if the profile has already been liked
        const isAlreadyLiked = authUser.likedProfiles.some(
            (profile) => profile.username === username
        );

        if (isAlreadyLiked) {
            // Remove the profile from likedProfiles
            authUser.likedProfiles = authUser.likedProfiles.filter(
                (profile) => profile.username !== username
            );
            await authUser.save();
            return res.status(200).json({ message: "User disliked" });
        } else {
            // Fetch user profile from GitHub
            const userRes = await fetch(`https://api.github.com/users/${username}`, {
                headers: {
                    authorization: `token ${process.env.GITHUB_API_KEY}`
                }
            });

            if (!userRes.ok) {
                throw new Error('User not found');
            }

            const userProfile = await userRes.json();

            // Add the profile to likedProfiles
            authUser.likedProfiles.push({
                username: userProfile.login,
                avatarUrl: userProfile.avatar_url,
                likedDate: Date.now()
            });

            await authUser.save();
            return res.status(200).json({ message: "User liked" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getLikes = async (req, res) => {
    try {
        const user = await User.findById(req.user._id.toString());
        res.status(200).json({ likedBy: user.likedProfiles });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const removeLike = async (req, res) => {
    try {
        const { username } = req.params;
        const authUser = await User.findById(req.user._id.toString());

        if (!authUser) {
            return res.status(404).json({ error: "Authenticated user not found" });
        }

        // Check if the profile is liked
        const isLiked = authUser.likedProfiles.some(profile => profile.username === username);

        if (!isLiked) {
            return res.status(400).json({ error: "Profile not liked" });
        }

        // Remove the profile from likedProfiles
        authUser.likedProfiles = authUser.likedProfiles.filter(profile => profile.username !== username);

        await authUser.save();
        return res.status(200).json({ message: "User unliked" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
