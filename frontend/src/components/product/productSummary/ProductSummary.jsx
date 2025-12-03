import InfoBox from "../../infoBox/InfoBox";
import "./ProductSummary.scss";
import React from "react";
import { BiCategory } from "react-icons/bi";
import { AiFillDollarCircle } from "react-icons/ai";
import { BsCart4, BsCartX } from "react-icons/bs";

//icons
const earningIcon = <AiFillDollarCircle size={40} color="#ffff" />;
const categoryIcon = <BiCategory size={40} color="#ffff" />;
const productIcon = <BsCart4 size={40} color="#ffff" />;
const outOfStockIcon = <BsCartX size={40} color="#ffff" />;

// Format Amount
 const formatNumbers = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
const ProductSummary = ({ products, totalStoreValue, outOfStock, category }) => {
  return (
    <div className="product-summary">
      <h3 className="--mt">Inventory Stats</h3>
      <div className="info-summary">
        <InfoBox
          icon={productIcon}
          title={"Total Products"}
          count={products.length}
          bgColor={"card1"}
        />
        <InfoBox
          icon={earningIcon}
          title={"Total Store Value"}
          count={`$${formatNumbers(totalStoreValue)}`}
          bgColor={"card2"}
        />
        <InfoBox
          icon={outOfStockIcon}
          title={"out Of Stock"}
          count={outOfStock}
          bgColor={"card3"}
        />
        <InfoBox
          icon={categoryIcon}
          title={"All Categories"}
          count={category.length}
          bgColor={"card4"}
        />
        
      </div>
    </div>
  );
};

export default ProductSummary;
