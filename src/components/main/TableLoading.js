import React from "react";

const TableLoading = ({ columns }) => {
  const numberOfRows = Math.floor(Math.random() * 5) + 2;
  return (
    <tbody className="animate-pulse">
      {[...Array(numberOfRows)].map((e, i) => {
        return (
          <tr key={"row" + i}>
            {[...Array(columns)].map((e, i) => {
              return (
                <td  key={"column" + i} style={{padding: "1.5rem"}}>
                  <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

TableLoading.defaultProps = {
  columns: 10
};

export default TableLoading;
