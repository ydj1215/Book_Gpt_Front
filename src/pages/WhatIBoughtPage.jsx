import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookAxiosApi } from "../api/BookAxiosApi";
import { Table } from "../globalStyle/StyledTable";
import { Th } from "../globalStyle/StyledTable";
import { Td } from "../globalStyle/StyledTable";
import { MiddleOrderBox } from "../globalStyle/MiddleOrderBox";
import { StyledTitle } from "../globalStyle/StyledTitle";
import Footer from "../components/mainPageComp/Footer";
import icon from "../assets/images/loginLogo/buybook.png";

export const WhatIBoughtPage = () => {
  const [boughtBooks, setBoughtBooks] = useState([]);
  const [contentUrl, setContentUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      const result = await BookAxiosApi.getBoughtBooks(userId);

      const booksWithDetails = await Promise.all(
        result.data.map(async (book) => {
          const bookDetail = await BookAxiosApi.findBookById(book.bookId);
          return { ...book, ...bookDetail.data };
        })
      );

      // bookID를 기준으로 오름차순 정렬
      const sortedBooks = booksWithDetails.sort((a, b) => a.bookId - b.bookId);
      setBoughtBooks(sortedBooks);
    };

    fetchData();
  }, []);

  const handleRowClick = (book) => {
    console.log(book.contentUrl);
    setContentUrl(book.contentUrl);
    if (contentUrl === null) {
      alert("contentUrl = Null");
    }
    if (window.confirm("뷰어를 여시겠습니까?")) {
      navigate("/ViewerPage", { state: { contentUrl: book.contentUrl } });
    }
  };

  const deleteClick = async (book) => {
    console.log(book.buyId);
    if (window.confirm("구매한 책을 정말로 삭제하시겠습니까?")) {
      try {
        await BookAxiosApi.deleteBuyBook(book.buyId);
        console.log("구매 삭제 성공");
        alert("책이 내 서재에서 삭제되었습니다.");
        window.location.reload();
      } catch (error) {
        console.error("구매 삭제 실패 : ", error);
      }
    }
  };

  return (
    <>
      <StyledTitle>
        <img src={icon} alt="구매 책 아이콘" style={{ width: "6vw" }} />
        &nbsp;구매한 책 목록
      </StyledTitle>
      <MiddleOrderBox>
        <Table>
          <thead>
            <tr>
              <Th>구매 ID</Th>
              {/* <th>회원 ID</th> */}
              <Th>책 ID</Th>
              <Th>책 제목</Th>
              <Th>표지</Th>
              <Th>저자</Th>
              <Th>클릭</Th>
            </tr>
          </thead>
          <tbody>
            {boughtBooks.map((book, index) => (
              <tr key={index} onClick={() => handleRowClick(book)}>
                <Td>{book.buyId}</Td>
                {/* <td>{book.memberId}</td> */}
                <Td>{book.bookId}</Td>
                <Td>{book.title}</Td>
                <Td>
                  <img
                    src={book.imageUrl}
                    alt="표지"
                    width="200px"
                    height="250px"
                  ></img>
                </Td>
                <Td>{book.author}</Td>
                <Td
                  onClick={(e) => {
                    e.stopPropagation(); // 이벤트 버블링 중지
                    deleteClick(book);
                  }}
                >
                  삭제
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </MiddleOrderBox>
      <Footer></Footer>
    </>
  );
};
