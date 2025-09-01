import React from "react";
import { Row, Col, Badge } from "react-bootstrap";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

const OrderStatusCard = ({ orderItem }) => {
  console.log("아이템이 왜 제대로 안뜹니까", orderItem.items)
  return (
    <div>
      <Row className="status-card">
        <Col xs={2} className="d-flex justify-content-center align-items-center">
          <img
            src={orderItem.items[0]?.productId?.image}
            alt={orderItem.items[0]?.productId?.image}
            height={96}
            className="mb-1"
          />
        </Col>
        <Col xs={8} className="order-info">
          <div>
            <strong>주문번호: {orderItem.orderNum}</strong>
          </div>

          <div className="text-12">{orderItem.createdAt.slice(0, 10)}</div>

          <div>
            {orderItem.items[0].productId.name}
            {orderItem.items.length > 1 && `외 ${orderItem.items.length - 1}개`}
          </div>
          <div>₩ {currencyFormat(orderItem.totalPrice)}</div>
        </Col>
        <Col md={2} className="vertical-middle">
          {/* <div className="text-align-center text-12 fw-bold">주문상태</div> */}
          <Badge 
              bg={badgeBg[orderItem.status]}
              className="text-center align-middle">
                {orderItem.status}
          </Badge>
        </Col>
      </Row>
    </div>
  );
};

export default OrderStatusCard;
