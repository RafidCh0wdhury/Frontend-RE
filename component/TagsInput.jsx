import React, { useRef, useState } from "react";

const TagInput = ({ tags, setTags, inputRef }) => {
  const handleKeyDown = (event) => {
    event.stopPropagation();
    if (event.key === "Enter" && inputRef.current?.value.trim()) {
      const newTag = inputRef.current.value.trim();

      if (!tags.includes(newTag)) {
        setTags((prevTags) => [...prevTags, newTag]);
      }

      inputRef.current.value = "";
      event.preventDefault();
    }
  };

  return (
    <div className="mb-5">
      <h3>Tags</h3>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        {tags.map((tag, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px 10px",
              borderRadius: "15px",
              fontSize: "14px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <p>{tag}</p>
          </div>
        ))}
        {tags.length === 0 && (
          <span style={{ color: "#aaa", fontSize: "14px" }}>No tags added</span>
        )}
      </div>

      <input
        type="text"
        ref={inputRef}
        onKeyDown={handleKeyDown}
        placeholder="Type a tag and press Enter"
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "14px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
    </div>
  );
};

export default TagInput;
