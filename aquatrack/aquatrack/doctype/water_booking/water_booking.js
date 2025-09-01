// // Copyright (c) 2025, nj and contributors
// // For license information, please see license.txt

// frappe.ui.form.on("Water Booking", {
//     after_save: function(frm) {
//         let phone = frm.doc.number;
//         let items_list = frm.doc.items || [];

//         let so_items = items_list.map(row => ({
//             item_code: row.item,
//             qty: row.quantiry || 1,

//         }));

//         frappe.call({
//             method: "frappe.client.get_list",
//             args: {
//                 doctype: "Customer",
//                 fields: ["name", "customer_name"],
//                 filters: {mobile_no: phone},
//                 limit: 1
//             }
//         })
//     }
// });
