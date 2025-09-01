import React from "react";
import { Table, Badge } from "react-bootstrap";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

const OrderTable = ({ header, data, openEditForm }) => {
  data.forEach(item => console.log("dataitemlist", item));

  return (
    <div className="overflow-x">
      <Table striped bordered hover>
        {/* 테이블 헤더 */}
        <thead>
          <tr>
            {header.map((title, idx) => (
              <th key={idx}>{title}</th>
            ))}
          </tr>
        </thead>

        {/* 테이블 바디 */}
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item._id} onClick={() => openEditForm(item)}>
                <td>{index + 1}</td>
                <td>{item.orderNum}</td>
                <td>{item.createdAt.slice(0, 10)}</td>
                <td>{item.userId.email}</td>

                {item.items.length > 0 ? (
                  <td>
                    
                    {item.items[0].productId.name}
                    {item.items.length > 1 && ` 외 ${item.items.length - 1}개`}
                  </td>
                ) : (
                  <td></td>
                )}

                <td>{item.shipTo.address + " " + item.shipTo.city}</td>
                <td>{currencyFormat(item.totalPrice)}</td>
                <td>
                  <Badge bg={badgeBg[item.status]}>{item.status}</Badge>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={header.length} className="text-center">
                No Data to show
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderTable;
