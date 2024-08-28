import { useCallback, useEffect, useState } from "react";
import ProfileInfo from "../components/ProfileInfo";
import Repos from "../components/Repos";
import Search from "../components/Search";
import SortRepos from "../components/SortRepo";
import Spinner from "../components/Spinner";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext"; // Import AuthContext to access authUser

const HomePage = () => {
  const { authUser } = useAuthContext(); // Access the authenticated user
  const [userProfile, setUserProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState("recent");

  const getUserProfileAndRepos = useCallback(async (username) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/users/profile/${username}`);
      if (res.status === 404) {
        throw new Error('User not found');
      }
      const { repos, userProfile } = await res.json();
      repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // descending
      setRepos(repos);
      setUserProfile(userProfile);
      console.log("userProfile...", userProfile);
      console.log("userRepos...", repos);
      return { userProfile, repos };
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const username = authUser ? authUser.username : 'araviind-p';
    getUserProfileAndRepos(username);
  }, [authUser, getUserProfileAndRepos]);

  // const onSearch = async (e, username) => {
  //   e.preventDefault();

  //   setLoading(true);
  //   setUserProfile(null);
  //   setRepos([]);

  //   const { userProfile, repos } = await getUserProfileAndRepos(username);
  //   if(!userProfile || !repos){
  //     toast.error("User not found");
  //     return;
  //   }
  //   console.log("userProfile in home...", userProfile);
  //   console.log("repos in home...", repos);
  //   setUserProfile(userProfile);
  //   setRepos(repos);
  //   setLoading(false);
  //   setSortType("recent");
  // };

  const onSearch = async (e, username) => {
    e.preventDefault();

    setLoading(true);
    setUserProfile(null);
    setRepos([]);

    try {
      const { userProfile, repos } = await getUserProfileAndRepos(username);
      if (!userProfile || repos.length === 0) {
        toast.error("User not found");
        return;
      }
      console.log("userProfile in home...", userProfile);
      console.log("repos in home...", repos);
      setUserProfile(userProfile);
      setRepos(repos);
      setSortType("recent");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const onSort = (sortType) => {
    if (sortType === "recent") {
      repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // descending
    } else if (sortType === "stars") {
      repos.sort((a, b) => b.stargazers_count - a.stargazers_count); // descending, most stars first
    } else if (sortType === "forks") {
      repos.sort((a, b) => b.forks_count - a.forks_count); // descending, most forks first
    }
    setSortType(sortType);
    setRepos([...repos]);
  };

  return (
    <div className="m-4">
      <Search onSearch={onSearch} />
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-4">
        {/* ProfileInfo and SortRepos are displayed side-by-side on larger screens */}
        <div className="flex flex-col gap-4 lg:w-2/4">
          {userProfile && !loading && <ProfileInfo userProfile={userProfile} />}
        </div>
        <div className="flex flex-col gap-4 lg:w-3/4">
          {repos.length > 0 && !loading && (
            <div className="flex flex-col gap-4">
              <div className="w-full lg:hidden">
                <SortRepos onSort={onSort} sortType={sortType} />
              </div>
              <div className="hidden lg:block w-full">
                <SortRepos onSort={onSort} sortType={sortType} />
              </div>
              <div className="w-full">
                <Repos repos={repos} />
              </div>
            </div>
          )}
          {loading && <Spinner />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
