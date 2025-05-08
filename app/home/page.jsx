// pages/home.tsx
"use client";

import Select from "react-select";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import withBasicAuth from "../../component/withBasicAuth";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import TagInput from "../../component/TagsInput";

const options = [
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

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [classFile, setClassFile] = useState({});
  const [tags, setTags] = useState([]);
  const inputRef = useRef(null);

  const [chartOptions, setChartOptions] = useState({
    series: [0, 0, 0],
    options: {
      chart: { width: 500, height: 500, type: "pie" },

      labels: ["Total Resources", "My Resources", "My List Resources"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 200 },
          },
        },
      ],
    },
  });

  useEffect(() => {
    const details = localStorage.getItem("userDetails");

    if (!details) {
      router.push("/auth/login");
    } else {
      const userDetails = JSON.parse(details);
      setUser(userDetails);
    }
  }, []);

  useEffect(() => {
    fetchResourcesCount();
  }, [user]);

  const fetchResourcesCount = async () => {
    if (user?.id) {
      const result = await axios.get(
        `http://44.203.163.29:3000/resources-count/${user.id}`
      );

      const counts = result.data;

      setChartOptions((prevOptions) => ({
        ...prevOptions,
        series: [
          counts.allResources,
          counts.myResources,
          counts.myListResources,
        ],
      }));
    }
  };

  const handleChange = (selectedOption) => {
    setClassFile(selectedOption);
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !fileName) {
      toast("Please provide all information.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user?.id);
    formData.append("resourceName", fileName);
    formData.append("resourceClass", classFile.value || "CIT 160");
    formData.append("tags", tags.join(","));
    formData.append("pdf", file);

    try {
      const response = await fetch("http://44.203.163.29:3000/resource", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      toast("File uploaded successfully!");

      setFileName("");
      setFile(null);
      setTags([]);
      e.target.reset();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  if (!user) return null;

  return (
    <div>
      <h1 className="font-bold text-2xl text-center mb-10">
        Welcome {user?.name}!
      </h1>
      <div className="bg-[#e3decc] flex flex-col rounded-lg p-4 shadow-md">
        <div className="flex justify-between items-center">
          <div className="w-[50%]">
            <ReactApexChart
              options={chartOptions.options}
              series={chartOptions.series}
              type="donut"
              width={380}
            />
          </div>
          <div className="w-[50%] flex justify-between rounded-md">
            <div className="flex flex-col font-semibold gap-y-2">
              <label>Total Resources</label>
              <label>My Uploads</label>
              <label>My List Resources</label>
            </div>
            <div className="flex flex-col gap-y-2">
              <span>{chartOptions?.series[0]}</span>
              <span>{chartOptions?.series[1]}</span>
              <span>{chartOptions?.series[2]}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="ml-2 p-4 rounded-md">
          <h2 className="text-center text-xl font-semibold mb-5">
            Upload your notes!
          </h2>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              File Name
            </label>
            <input
              type="text"
              id="fileName"
              onChange={(e) => setFileName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="filename"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Class
            </label>
            <Select
              className="mb-5"
              value={classFile}
              onChange={handleChange}
              options={options}
            />
          </div>
          <TagInput tags={tags} setTags={setTags} inputRef={inputRef} />
          <div className="flex flex-col space-y-5">
            <input type="file" onChange={handleFileChange} />
            <button
              type="submit"
              className="mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-fit px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default withBasicAuth(Home);
