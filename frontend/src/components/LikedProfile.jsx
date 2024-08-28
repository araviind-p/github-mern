import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const LikeProfile = ({ userProfile }) => {
    const { authUser } = useAuthContext();
    const [alreadyLiked, setAlreadyLiked] = useState(false);

    const isOwnProfile = authUser?.username === userProfile.login;

    useEffect(() => {
        const getLikes = async () => {
            try {
                const res = await fetch("/api/users/likes", { credentials: "include" });
                const data = await res.json();
                if (data.error) throw new Error(data.error);

                // Check if the current profile is liked
                const liked = data.likedBy.some(profile => profile.username === userProfile.login);
                setAlreadyLiked(liked);
            } catch (error) {
                toast.error(error.message);
            }
        };

        if (authUser) {
            getLikes();
        }
    }, [authUser, userProfile.login]);

    const handleLikeProfile = async () => {
        try {
            const res = await fetch(`/api/users/like/${userProfile.login}`, {
                method: "POST",
                credentials: "include",
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            setAlreadyLiked(prev => !prev); // Toggle the liked status
            toast.success(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (!authUser || isOwnProfile) return null;

    return (
        <button
            className='p-2 text-xs w-full font-medium rounded-md bg-glass border border-blue-400 flex items-center gap-2'
            onClick={handleLikeProfile}
        >
            <FaHeart size={16} color={alreadyLiked ? 'red' : 'white'} />
            {alreadyLiked ? 'Dislike Profile' : 'Like Profile'}
        </button>
    );
};

export default LikeProfile;
