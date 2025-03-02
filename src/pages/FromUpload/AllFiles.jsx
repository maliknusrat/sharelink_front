import React, { useState, useEffect } from "react";
import { RiShareForwardFill } from "react-icons/ri";
import Modal from "react-modal";

// Custom styles for the modal
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "50%",
    transform: "translate(-50%, -50%)",
  },
};

const AllFiles = () => {
  const [files, setFiles] = useState([]); // Store the fetched files
  const [loading, setLoading] = useState(false); // Manage loading state
  const [error, setError] = useState(""); // Manage error state
  const [success, setSuccess] = useState(""); // Manage success state
  const [modalIsOpen, setIsOpen] = useState(false); // State for modal visibility
  const [selectedFile, setSelectedFile] = useState(null); // Store selected file
  const [visibility, setVisibility] = useState("public"); // State to track visibility ("public" or "private")
  const [expireTime, setExpireTime] = useState({ days: 0, hours: 0 }); // Expiry time state
  const [generatedLink, setGeneratedLink] = useState(""); // State to store the generated link

  // Fetch files on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("https://sharelink-tau.vercel.app/api/v1/file", {
          method: "GET", // Add GET method explicitly
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`, // Proper string interpolation
          },
        });

        const data = await response.json();
        setFiles(data.data); // Assuming the API returns an object with a 'files' array
      } catch (err) {
        setError(err.message); // Error handling
      }
    };

    fetchFiles();
  }, []);

  function openModal(file) {
    setSelectedFile(file);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setGeneratedLink(""); // Clear generated link when closing modal
  }

  function handleVisibilityChange(event) {
    setVisibility(event.target.value); // Update visibility state based on selected radio button
  }

  function handleExpireTimeChange(event) {
    const { name, value } = event.target;
    setExpireTime((prevExpireTime) => ({
      ...prevExpireTime,
      [name]: value,
    }));
  }

  const calculateExpireTimeInSeconds = () => {
    const daysInSeconds = expireTime.days * 86400; // Convert days to seconds
    const hoursInSeconds = expireTime.hours * 3600; // Convert hours to seconds
    return daysInSeconds + hoursInSeconds;
  };

  const handleGenerateLink = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    // Calculate expiration time in seconds
    const expire = calculateExpireTimeInSeconds();

    // Prepare the payload
    const payload = {
      type: visibility, // either "public" or "private"
      expire, // expiration time in seconds
    };
    console.log(payload);
    console.log("id", selectedFile._id);
    try {
      const response = await fetch(
        `https://sharelink-tau.vercel.app/api/v1/file/${selectedFile._id}/create-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      setGeneratedLink(result.data);
      // Assuming the API returns the generated link
      console.log(result);
      setSuccess("Link generated successfully!"); // Display success message
    } catch (error) {
      setError(error.message);
      console.error("Error generating link:", error);
    } finally {
      setLoading(false);
    }
  };

  //   Delete Link function
  const handleDeleteLink = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    let successSplit = generatedLink.split("/").length;
    let id = generatedLink.split("/")[successSplit - 1];

    try {
      // Send DELETE request to remove the generated link
      const response = await fetch(
        `https://sharelink-tau.vercel.app/api/v1/file/${id}/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      // Handle server response
      if (!response.ok) {
        throw new Error("Failed to delete the link.");
      }

      // Clear the generated link from state after successful deletion
      setGeneratedLink("");
      setSuccess("Link deleted successfully!"); // Show success message
    } catch (error) {
      setError(error.message); // Show error message if something goes wrong
      console.error("Error deleting link:", error);
    } finally {
      setLoading(false);
    }
  };

  //   Edit Link function
  const handleEditLinkVisibility = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
  
    // Extract the file ID from the generated link
    const successSplit = generatedLink.split("/").length;
    const id = generatedLink.split("/")[successSplit - 1]; // Get the file ID from the generated link
  
    // Prepare the payload to update the visibility of the link
    const updatedVisibility = visibility === "public" ? "private" : "public"; // Toggle visibility
  
    // Calculate expiration time in seconds if the new visibility is "private"
    const expire = updatedVisibility === "private" ? calculateExpireTimeInSeconds() : 0; // Set expire time to 0 if public
  
    const payload = {
      type: updatedVisibility, // new visibility (public or private)
      expire, // expiration time in seconds
    };
  
    try {
      // Send PUT request to update the visibility and expiration of the link
      const response = await fetch(
        `https://sharelink-tau.vercel.app/api/v1/file/${id}`, // Assuming the backend endpoint for updating the visibility
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update the link visibility.");
      }
  
      // After the successful update, update the state with the new visibility
      setVisibility(updatedVisibility); // Update the visibility state
      setSuccess(`Link visibility updated to ${updatedVisibility}!`); // Show success message
    } catch (error) {
      setError(error.message); // Show error message if something goes wrong
      console.error("Error updating link visibility:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="h-screen bg-zinc-100 dark:bg-zinc-800">
      <div>
        <div className="text-center text-xl font-semibold py-6">
          All Files Here
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {files.length === 0 ? (
              <p>No files available</p>
            ) : (
              files.map((file) => (
                <div key={file.id} className="flex flex-col items-start gap-1">
                  <div className="join">
                    <input
                      type="text"
                      placeholder="Type here"
                      value={file.name}
                      className="input input-bordered input-primary w-full rounded-r-none max-w-xs"
                    />
                    <div
                      className="btn btn-outline rounded-l-none btn-primary"
                      onClick={() => openModal(file)} // Open modal on button click
                    >
                      <RiShareForwardFill className="text-2xl" />
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500">{file.size} KB</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Share File Modal"
        >
          <div className="flex justify-between">
            <h2 className="hover:underline ">Share Link</h2>
            <button onClick={closeModal}>X</button>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl font-semibold">{selectedFile?.name}</div>
            <div className="mt-4 flex items-center gap-2">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === "public"}
                  onChange={handleVisibilityChange}
                />
                Public
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === "private"}
                  onChange={handleVisibilityChange}
                />
                Private
              </label>
            </div>

            {/* Conditionally render Expire Time section based on visibility */}
            {visibility === "private" && (
              <div className="mt-4">
                <label>Expire Time</label>
                <div className="flex items-center gap-5">
                  <input
                    type="number"
                    name="days"
                    placeholder="Days"
                    value={expireTime.days}
                    onChange={handleExpireTimeChange}
                    className="input input-bordered"
                  />
                  <input
                    type="number"
                    name="hours"
                    placeholder="Hours"
                    value={expireTime.hours}
                    onChange={handleExpireTimeChange}
                    className="input input-bordered"
                  />
                </div>
              </div>
            )}

            <button
              className="btn btn-sm btn-primary mt-4"
              onClick={handleGenerateLink}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Link"}
            </button>

            {generatedLink && (
              <div className="mt-4">
                <p>Generated Link:</p>
                <input
                  type="text"
                  value={generatedLink}
                  readOnly
                  className="input input-bordered w-full mt-2"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedLink)}
                    className="btn btn-sm btn-secondary"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={handleDeleteLink} // Delete functionality
                    className="btn btn-sm btn-danger"
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Delete Link"}
                  </button>
                  <button
                    onClick={handleEditLinkVisibility} // Toggle visibility functionality
                    className="btn btn-sm btn-warning"
                    disabled={loading}
                  >
                    {loading
                      ? "Updating..."
                      : `Make Link ${
                          visibility === "public" ? "Private" : "Public"
                        }`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AllFiles;
