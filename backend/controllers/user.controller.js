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
            throw new Error('User not found')
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

// export const likeProfile = async (req, res) => {
//     try {
//         const { username } = req.params;
//         // const user = await User.findById(req.user._id.toString());
//         const authUser = await User.findById(req.user._id.toString());
//         // console.log(user, "auth user");
//         // const userToLike = await User.findOne({ username });

//         // if (!userToLike) {
//         //     return res.status(404).json({ error: "User is not a member" });
//         // }

//         // if (user.likedProfiles.includes(userToLike.username)) {
//         //     return res.status(400).json({ error: "User already liked" });
//         // }

//         if (authUser.likedProfiles.includes(username)) {
//             return res.status(400).json({ error: "User already liked" });
//         }

//         // userToLike.likedBy.push({ username: user.username, avatarUrl: user.avatarUrl, likedDate: Date.now() });
//         // user.likedProfiles.push(userToLike.username);
//         const userRes = await fetch(`https://api.github.com/users/${username}`, {
//             headers: {
//                 authorization: `token ${process.env.GITHUB_API_KEY}`
//             }
//         });

//         if (!userRes.ok) {
//             throw new Error('User not found');
//         }

//         const userProfile = await userRes.json();

//         authUser.likedProfiles.push({
//             username: userProfile.login,  // Use 'login' instead of 'username' to match GitHub's response
//             avatarUrl: userProfile.avatar_url,
//             likedDate: Date.now()
//         });

//         await authUser.save();

//         // await userToLike.save();
//         // await user.save();
//         // await Promise.all([userToLike.save(), user.save()]);

//         res.status(200).json({ message: "User liked" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


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
            return res.status(400).json({ error: "User already liked" });
        }

        const userRes = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                authorization: `token ${process.env.GITHUB_API_KEY}`
            }
        });

        if (!userRes.ok) {
            throw new Error('User not found');
        }

        const userProfile = await userRes.json();

        authUser.likedProfiles.push({
            username: userProfile.login,
            avatarUrl: userProfile.avatar_url,
            likedDate: Date.now()
        });

        await authUser.save();

        res.status(200).json({ message: "User liked" });
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