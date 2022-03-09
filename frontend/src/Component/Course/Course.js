import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../App";
import Card from "react-bootstrap/Card";
import { Grid, Row, Col } from "react-bootstrap";
import "./Course.css";

const Course = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursePerPage] = useState(6);

  const indexOfLastCourse = currentPage * coursePerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursePerPage;
  const currentCourse = allCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const pageNumbers = [];

  const getAllCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/course/getall");
      if (res.data.success) {
        setAllCourses(res.data.result);
      } else throw Error;
    } catch (error) {
      if (!error.response.data.success) {
      }
    }
  };
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    getAllCourses();
  }, []);
  for (let i = 1; i <= Math.ceil(allCourses.length / coursePerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="courseMainDiv">
      <div className="allCourses">
        <Row xs={1} md={2} className="g-4">
          {currentCourse.map((_, idx) => (
            <Col>
              <Card>
                <Card.Img
                  variant="top"
                  src="https://www.learnfly.com/img/post_img/1335475250_1_5ev1xmjs2-sj4ddejfdnqa.png"
                />
                <Card.Body>
                  <Card.Title>{_.Title}</Card.Title>
                  <Card.Text>{_.Author}</Card.Text>
                  <Card.Text>{_.Price}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="btata">
          <ul>
            {pageNumbers.map((number) => {
              return (
                <li>
                  <a
                    href="#"
                    onClick={() => {
                      paginate(number);
                    }}
                  >
                    {number}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        {/* {allCourses.map((element, index) => {
          return (
            <div key={index}>
              <div>
                <div>{element.Title}</div>
                <div>{element.Author}</div>
                <div>{element.Price}</div>
              </div>
            </div>
          );
        })} */}
      </div>
    </div>
  );
};

export default Course;
