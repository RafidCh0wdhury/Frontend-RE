"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Download from "../../component/icons/Download";
import Delete from "../../component/icons/Delete";
import { useRouter } from "next/navigation";
import BackButton from "../../component/BackButton";
import withBasicAuth from "../../component/withBasicAuth";
import ReactApexChart from "react-apexcharts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
};

const Upload = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);

  const [classBasedChartOptions, setClassBasedChartOptions] = useState({
    series: [0, 0],
    options: {
      chart: { width: 380, height: 380, type: "pie" },
      labels: ["CIT 360", "IS 441"],
      legend: {
        labels: {
          position: "bottom",
          colors: "#FFFFFF",
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 200 },
            legend: { position: "bottom" },
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
  }, [router]);

  useEffect(() => {
    // Only fetch resources if user is set
    if (user) {
      fetchMyResources();
      fetchResourcesCount();
    }
  }, [user]);

  const fetchResourcesCount = async () => {
    if (user?.id) {
      const result = await axios.get(
        `http://44.203.163.29:3000/resources-count/${user.id}`
      );

      const counts = result.data;

      setClassBasedChartOptions((prev) => ({
        ...prev,
        series: [
          counts.resourcesByClassCount[0].count,
          counts.resourcesByClassCount[1].count,
        ],
      }));
    }
  };

  const fetchMyResources = async () => {
    const response = await axios.get(
      `http://44.203.163.29:3000/my-resources/${user?.id}`
    );
    if (response.data) {
      console.log(response.data);
      setFiles(response.data);
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://44.203.163.29:3000/delete-resource/${id}`);
      await fetchMyResources();
      toast("Resource deleted successfully!");
    } catch (err) {
      console.error(err);
      toast("Resource couldn't be deleted. Please try again!");
    }
  };

  if (!user) return null;

  return (
    <div className="p-5">
      <div className="flex justify-end">
        <BackButton />
      </div>
      <div className="grid grid-cols-6">
        <div className="col-span-4">
          <h2 className="text-sm italic mb-2">
            {files.length === 1 ? "1 file" : `${files.length} files`} found
          </h2>
          <ul>
            {files.length > 0 &&
              files.map((item) => (
                <li
                  key={item.id}
                  className="bg-[#eee5c6] mb-3 border border-gray-300 shadow-md p-3 rounded-md flex items-center justify-between"
                >
                  <div>
                    <p>File Name: {item.resourceName}</p>
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

                  <div className="flex items-center gap-x-4">
                    <div
                      className="w-fit cursor-pointer"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Delete />
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
        </div>
        <div className="col-span-2">
          <ReactApexChart
            options={classBasedChartOptions.options}
            series={classBasedChartOptions.series}
            type="pie"
            width={380}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default withBasicAuth(Upload)
