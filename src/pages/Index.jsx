import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [sheets, setSheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetNames = workbook.SheetNames;
      const sheetsData = sheetNames.map((name) => ({
        name,
        data: XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 }),
      }));
      setSheets(sheetsData);
      setActiveSheet(sheetsData[0]);
    };

    reader.readAsArrayBuffer(file);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Excel File Processor</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {sheets.length > 0 && (
        <>
          <Tabs defaultValue={sheets[0].name} onValueChange={(value) => setActiveSheet(sheets.find(sheet => sheet.name === value))}>
            <TabsList>
              {sheets.map((sheet) => (
                <TabsTrigger key={sheet.name} value={sheet.name}>
                  {sheet.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {sheets.map((sheet) => (
              <TabsContent key={sheet.name} value={sheet.name}>
                <div className="overflow-auto">
                  <table className="min-w-full bg-white">
                    <tbody>
                      {sheet.data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="border px-4 py-2">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
          <Button onClick={handlePrint} className="mt-4">
            Print
          </Button>
        </>
      )}
    </div>
  );
};

export default Index;