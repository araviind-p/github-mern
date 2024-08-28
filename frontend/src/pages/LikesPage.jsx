import { useEffect, useState } from "react";
import { FaHeart, FaSpinner } from "react-icons/fa"; // Import spinner icon
import toast from "react-hot-toast";
import { formatDate } from "../utils/functions";
import { useAuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner"; // Ensure this is the correct path

const LikesPage = () => {
	const [likes, setLikes] = useState([]);
	const [loading, setLoading] = useState(false); // Add loading state
	const { authUser } = useAuthContext();

	const handleLikes = async (user) => {
		try {
			setLoading(true); // Start loading
			const res = await fetch(`/api/users/removeLike/${user.username}`, {
				method: "POST", // Assuming removeLike is a POST request
				credentials: "include"
			});
			const data = await res.json();

			if (data.error) throw new Error(data.error);

			// Handle success (e.g., update UI, notify user)
			toast.success(data.message);

			// Refresh the likes list
			const resLikes = await fetch("/api/users/likes", { credentials: "include" });
			const dataLikes = await resLikes.json();
			if (dataLikes.error) throw new Error(dataLikes.error);

			setLikes(dataLikes.likedBy);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false); // Stop loading
		}
	};

	useEffect(() => {
		const getLikes = async () => {
			try {
				const res = await fetch("/api/users/likes", { credentials: "include" });
				const data = await res.json();
				if (data.error) throw new Error(data.error);

				setLikes(data.likedBy);
			} catch (error) {
				toast.error(error.message);
			}
		};
		getLikes();
	}, []);

	return (
		<div className='pl-2 relative shadow-md rounded-lg '>
			{loading && (
				// <div className='absolute inset-0 flex items-center justify-center bg-gray-800'>
				<Spinner />
				/* Ensure Spinner component shows a loading animation */
				// </div>
			)}
			<table className='w-full text-sm text-left rtl:text-right bg-glass overflow-hidden'>
				<thead className='text-xs uppercase bg-glass'>
					<tr>
						<th scope='col' className='p-4'>
							<div className='flex items-center'>No</div>
						</th>
						<th scope='col' className='px-6 py-3'>
							Username
						</th>
						<th scope='col' className='px-6 py-3'>
							Date
						</th>
						<th scope='col' className='px-6 py-3'>
							Action
						</th>
					</tr>
				</thead>
				<tbody>
					{likes.map((user, idx) => (
						<tr className='bg-glass border-b' key={user.username}>
							<td className='w-4 p-4'>
								<div className='flex items-center'>
									<span>{idx + 1}</span>
								</div>
							</td>
							<th scope='row' className='flex items-center px-6 py-4 whitespace-nowrap'>
								<img className='w-10 h-10 rounded-full' src={user.avatarUrl} alt='User Avatar' />
								<div className='ps-3'>
									<div className='text-base font-semibold'>{user.username}</div>
								</div>
							</th>
							<td className='px-6 py-4'>{formatDate(user.likedDate)}</td>
							<td className='px-6 py-4'>
								<div className='flex items-center'>
									<FaHeart onClick={() => handleLikes(user)} size={22} className='text-red-500 mx-2 cursor-pointer' />
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default LikesPage;
