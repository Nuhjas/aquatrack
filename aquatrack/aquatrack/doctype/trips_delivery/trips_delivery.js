// Copyright (c) 2025, nj and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Trips Delivery", {
// 	refresh(frm) {

// 	},
// });
frappe.ui.form.on("Trips Delivery", {
    customer_namex: function(frm) {
        if (frm.doc.address) {
            frm.set_value("address", frm.doc.address.replace(/<br\s*\/?>/gi, "\n"));
        }
    }
});
