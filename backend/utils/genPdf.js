import PDFDocument from "pdfkit";

export const genPdf = ({ orders }) => {
  console.log(orders);
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = []; //stroing pdf chunks

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer); // concating that pdf in single file
      });

      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .text("Invoice", { align: "center" });
      doc.moveDown();

      doc.fontSize(12);
      doc.text(`Order ID: ${orders?._id}`);
      doc.text(`Customer: ${orders?.user?.fullName}`);

      orders.shopOrders.map((shopOrder) =>
        shopOrder.shopOrderItems.map((item) =>
          doc.text(`Item Name: ${item.name}`),
        ),
      );
      doc.text(`Total Amount: Rs. ${orders?.totalAmount}`);

      doc.moveDown();
      doc.text("Thank you for your order");

      doc.end(); // 🚨 MUST be called
    } catch (err) {
      reject(err);
    }
  });
};
