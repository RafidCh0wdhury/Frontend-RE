"use client";
import axios from "axios";
import Select from "react-select";
import { useEffect, useState } from "react";
import Add from "../../component/icons/Add";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "../../component/BackButton";
import Download from "../../component/icons/Download";
import { ToastContainer, toast } from "react-toastify";
import withBasicAuth from "../../component/withBasicAuth";

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
};

const optionsClass = [
  { value: "CIT 101", label: "CIT 101" },
  { value: "CIT 160", label: "CIT 160" },
  { value: "CIT 210", label: "CIT 210" },
  { value: "CIT 270", label: "CIT 270" },
  { value: "CIT 360", label: "CIT 360" },
  { value: "CIT 384", label: "CIT 384" },
  { value: "CIT 425", label: "CIT 425" },
  { value: "CIT 480", label: "CIT 480" },
  { value: "CIT 481", label: "CIT 481" },
  { value: "IS 212", label: "IS 212" },
  { value: "IS 312", label: "IS 312" },
  { value: "IS 355", label: "IS 355" },
  { value: "IS 431", label: "IS 431" },
  { value: "IS 435", label: "IS 435" },
  { value: "IS 441", label: "IS 441" },
  { value: "IS 451", label: "IS 451" },
  { value: "IS 457", label: "IS 457" },
  { value: "IS 530", label: "IS 530" },
];

const Notes = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [renderedFiles, setRenderedFiles] = useState([]);
  const [selectedClass, setSelectedClass] = useState({
    value: null,
    label: null,
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const details = localStorage.getItem("userDetails");

    if (!details) {
      router.push("/auth/login");
    } else {
      const userDetails = JSON.parse(details);
      setUser(userDetails);
    }
  }, [router]);

  useEffect(() => {
    // Only fetch resources if user is set
    if (user) {
      fetchMyResources();
    }
  }, [user]);

  const fetchMyResources = async () => {
    const response = await axios.get(
      `http://44.203.163.29:3000/all-resources/${user?.id}`
    );
    if (response.data) {
      setFiles(response.data);
      setRenderedFiles(response.data);
    }
  };

  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleString("en-US", options);
  };

  const handleDownload = (filePath) => {
    // Open the file URL in a new tab or prompt the download
    window.open(filePath, "_blank");
  };

  const handelAddToList = async (resourceId) => {
    const data = {
      userId: user.id,
      resourceId,
    };

    console.log(data);

    try {
      const response = await fetch("http://44.203.163.29:3000/add-to-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Ensure this is stringified
      });

      toast("Added to your list!");
    } catch (error) {
      console.error("Error Adding to list", error);
    }
  };

  useEffect(() => {
    handleSearch({ target: { value: searchTerm } });
  }, [selectedClass]);

  const handleChange = (selectedOption) => {
    // console.log(selectedOption.value);
    setSelectedClass((prev) => ({
      ...prev, // Spread the previous state
      label: selectedOption.label,
      value: selectedOption.value,
    }));
    // handleSearch({ target: { value: searchTerm } });
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const items = [...files];

    if (!selectedClass.value) {
      const filteredList = items.filter((f) => {
        const isNameMatch = f.resourceName.toLowerCase().includes(term);

        // Check if any of the tags contains the term (after splitting the tags by commas)
        const isTagMatch = f.tags
          ? f.tags.split(",").some((tag) => tag.toLowerCase().includes(term))
          : false;

        // Return true if either name or tags match
        return isNameMatch || isTagMatch;
      });
      setRenderedFiles(filteredList);
    } else {
      const classFilteredList = items.filter(
        (f) => f.resourceClass === selectedClass.value
      );
      const filteredSearchList = classFilteredList.filter((f) => {
        // Check if the resourceName contains the term
        const isNameMatch = f.resourceName.toLowerCase().includes(term);
  
        // Check if any of the tags contains the term
        const isTagMatch = f.tags
          ? f.tags.split(",").some((tag) => tag.toLowerCase().includes(term))
          : false;
  
        // Return true if either name or tags match
        return isNameMatch || isTagMatch;
      });
      setRenderedFiles(filteredSearchList);
    }
  };

  if (!user) return null;

  return (
    <div className="p-5">
      <div className="flex justify-end">
        <BackButton />
      </div>
      <div className="flex justify-between items-centers">
        <div className="w-[30%]">
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                />
              </svg>
            </div>
            <input
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search file..."
              required
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e);
              }}
            />
          </div>
        </div>
        <div className="w-[30%]">
          <Select
            className="mb-5"
            value={selectedClass}
            onChange={handleChange}
            options={optionsClass}
          />
        </div>
      </div>

      <ul>
        {renderedFiles.length > 0 &&
          renderedFiles.map((item) => (
            <li
              key={item.id}
              className="bg-[#eee5c6] mb-3 border border-gray-300 shadow-md p-3 rounded-md flex items-center justify-between"
            >
              <div>
                <p>Resource Name: {item.resourceName}</p>
                <p>Class: {item.resourceClass}</p>
                <p>
                  Uploaded by{" "}
                  <span className="font-semibold">{item.user.name}</span>
                </p>
                <p>Uploaded time: {formatTime(item.createdAt)}</p>
                <div className="flex space-x-2">
                  <p>Tags:</p>
                  <ul className="flex items-center space-x-2">
                    {item.tags.split(",").map((tag, index) => (
                      <li
                        key={index}
                        className="px-2 border border-yellow-700 rounded"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center space-x-5">
                <div
                  className="w-fit cursor-pointer"
                  onClick={() => handelAddToList(item.id)}
                >
                  <Add />
                </div>
                <div
                  className="w-fit cursor-pointer"
                  onClick={() => handleDownload(item.resourcePath)}
                >
                  <Download />
                </div>
              </div>
            </li>
          ))}
      </ul>
      <ToastContainer />
    </div>
  );
};

export default withBasicAuth(Notes);
