import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
function Courses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
   
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); 
      return;
    }

    fetch("http://localhost:5000/api/courses", {
      headers: { Authorization: `Bearer ${token}` }, 
    })
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error fetching courses:", err));
  }, [navigate]);

  return (
    <div>
      <h2>Available Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            <strong>{course.title}</strong> - {course.duration}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Courses;
