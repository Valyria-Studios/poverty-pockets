/* import React from "react";

const GenerateReport = ({ selectedFeatures }) => {
  const handleGenerateReport = () => {
    if (!selectedFeatures.length) {
      alert("No features selected!");
      return;
    }

    const reportData = selectedFeatures.map((feature) => ({
      id: feature.id,
      name: feature.name || "N/A",
      population: feature.population || "N/A",
      income: feature.income || "N/A",
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Name,Population,Income"]
        .concat(
          reportData.map(
            (row) =>
              `${row.id},${row.name},${row.population},${row.income}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleGenerateReport}
      style={{
        padding: "10px 20px",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Generate Report
    </button>
  );
};

export default GenerateReport;
*/