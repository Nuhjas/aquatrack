// // Copyright (c) 2025, nj and contributors
// // For license information, please see license.txt

// // frappe.ui.form.on("Trips Delivery", {
// // 	refresh(frm) {

// // 	},
// // });

frappe.ui.form.on("Trips Delivery", {
    customer_namex: function (frm) {
        if (frm.doc.address) {
            frm.set_value("address", frm.doc.address.replace(/<br\s*\/?>/gi, "\n"));
        }
    },

    validate: function(frm) {
        if (frm.doc.tr_status === "Delivered" && !frm.confirmed) {
            frappe.validated = false; 

            frappe.confirm(
                "Are you sure the entered details are correct?",
                function() {
                    
                    frm.confirmed = true; 
                    frm.save(); 
                    frappe.show_alert({message: "Stock updated", indicator: "green"})
                },
                function() {

                    frappe.show_alert({ message: "Submittion Cancelled", indicator: "red" });
                }
            );
        }
    }
});
