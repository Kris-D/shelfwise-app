import React from "react";
import "./productList.scss";
import { SpinnerImg } from "../../loader/Loader";
import { FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { AiOutlineEye } from "react-icons/ai";
import Search from "../../search/Search";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FILTER_PRODUCTS,
  selectFilteredProducts,
} from "../../../redux/features/product/fiterSlice";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useNavigate } from "react-router-dom";

const ProductList = ({ products, isPending, handleDeleteProduct }) => {
  const [search, setSearch] = useState("");
  const filteredProducts = useSelector(selectFilteredProducts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const shortenText = (text, n) => {
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat("...");
      return shortenedText;
    }
    return text;
  };

  // Delete Product Confirmation Modal
  const confirmDelete = (id) => {
    confirmAlert({
      title: 'Delete Product',
      message: 'Are you sure you want to delete this.',
      buttons: [
        {
          label: 'Delete',
          onClick: () => handleDeleteProduct(id)
        },
        {
          label: 'Cancel',
          // onClick: () => alert('Click No')
        }
      ]
    });
  }

  // Begin pagination logic
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredProducts.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);
  };
  // End pagination logic

  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search }));
  }, [products, search, dispatch]);
 // Format Amount
 const formatNumbers = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
  return (
    <div className="product-list">
      <hr />
      <div className="table">
        <div className="--flex-between --flex-dir-column">
          <span>
            <h3>Inventory Items</h3>
          </span>
          <span>
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </span>
        </div>
        {isPending && <SpinnerImg />}
        <div className="table">
          {!isPending && products.length === 0 ? (
            <p> -- No Products Found, Please add a Product ....</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th> Name</th>
                  <th> Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th> Value</th>
                  <th> Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((product, index) => {
                  const { _id, name, category, price, quantity } = product;
                  return (
                    <tr key={_id}>
                      <td>{itemOffset + index + 1}</td>
                      <td>{shortenText(name, 16)}</td>
                      <td>{category}</td>
                      <td> {"$"}{formatNumbers(price) }</td>
                      <td>{formatNumbers(quantity) }</td>
                      <td>
                        {"$"}
                        {formatNumbers(price * quantity)}
                      </td>
                      <td className="icons">
                        <span>
                          <AiOutlineEye size={25} color={"purple"} onClick={() => navigate(`/product-details/${_id}`)} />
                        </span>
                        <span>
                          <FaEdit size={20} color={"green"} onClick={() => navigate(`/edit-product/${_id}`)} />
                        </span>
                        <span>
                          <FaTrashCan size={20} color={"red"} onClick={() => confirmDelete(_id)} />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="< Prev"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="activePage"
        />
      </div>
    </div>
  );
};

export default ProductList;
