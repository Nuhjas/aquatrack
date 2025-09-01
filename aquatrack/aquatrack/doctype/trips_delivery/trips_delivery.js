// // Copyright (c) 2025, nj and contributors
// // For license information, please see license.txt


// // frappe.ui.form.on("Trips Delivery", {
// // 	refresh(frm) {

// // 	},
// // });

function stock_get(frm, cdt, cdn) {

    let row = locals[cdt][cdn];

    frappe.call({
        method: "frappe.client.get_value",
        args: {
            doctype: "Bin",
            filters: {
                item_code: row.item_code,
                warehouse: frm.doc.warehouse_customer,
            },
            fieldname: "actual_qty"
        },
        callback: function (r) {
            //frm.fields_dict.number_of_can_return.$wrapper.find(".stock-info").remove();

            let stock = r.message ? r.message.actual_qty : 0;

            frappe.model.set_value(cdt, cdn, "item_stock", stock);

            // frm.fields_dict.number_of_can_return.$wrapper.append(
            //     `<div class="stock-info" style="color:black; margin-top:5px;"> 
            //             Available Stock: ${stock}
            //             </div>`
            // );
        }
    })
}

function set_address(frm) {
    if (frm.doc.address_get) {

        let normalized = frm.doc.address_get.replace(/<br\s*\/?>/gi, "\n");


        let parts = normalized.split(/\n/).filter(Boolean);


        let clean_address = parts.map((line, i) => {
            if (i === parts.length - 1) {
                return line.trim() + ".";
            }
            return line.trim() + ",";
        }).join(" ");


        frm.set_value("address", clean_address);
    }
}


frappe.ui.form.on("Delivery Items", {

    item_code: function (frm, cdt, cdn) {


        stock_get(frm, cdt, cdn);

    },

    items_add: function (frm, cdt, cdn) {
        stock_get(frm, cdt, cdn);
    },

    items_on_form_rendered: function (frm, cdt, cdn) {

        stock_get(frm, cdt, cdn);
    },

    // do_action: function(frm, cdt, cdn) {
    //     let row = locals[cdt][cdn];
    //     frappe.msgprint(`⚡ Button clicked for: ${row.item_code}`);
    // }

    form_render(frm, cdt, cdn){
        let row = locals[cdt][cdn];
        let field = frm.fields_dict["items"].grid.grid_rows_by_docname[row.name].grid_form.fields_dict.number_of_can_return;

        if (field && field.$input) {
            field.$input.off("keyup.validate_can").on("keyup.validate_can", function(){
                let entered_can = parseInt($(this).val()) || 0;
                let stock = row.item_stock || 0;

                if (entered_can > stock){
                    $(this).val(stock);
                    frappe.model.set_value(cdt, cdn, "number_of_can_return", stock);
                }
            })
        }
    }
    


});


frappe.ui.form.on("Trips Delivery", {


    refresh: function (frm) {
        if (frm.doc.tr_status === "Delivered") {
            frm.disable_form();
            //console.log(frm.doc.tr_status)
        }

        if (frm.doc.items && frm.doc.warehouse_customer) {
            frm.doc.items.forEach(row => {

                if (row.item_code) {
                    stock_get(frm, row.doctype, row.name);
                }
            });
        }

        // frm.fields_dict.number_of_can_return.$input.on("keyup", function () {

        //     let entered_can = parseInt($(this).val()) || 0;
        //     let stock = (frm.doc.items && frm.doc.items.length > 0) ? frm.doc.items[0].item_stock || 0 : 0;

        //     if (entered_can > stock) {

        //         $(this).val(stock);
        //         frm.set_value("number_of_can_return", stock);
        //     }
        // })

        // frm.fields_dict["items"].grid.add_custom_button("Custom Action", (row) => {
        //     frappe.msgprint("Button clicked for ");
        // }, "row");


        set_address(frm);

        


    },






    onload: function (frm) {
        if (frm.doc.items && frm.doc.warehouse_customer) {
            frm.doc.items.forEach(row => {

                if (row.item_code) {
                    stock_get(frm, row.doctype, row.name);
                }
            });
        }
        set_address(frm);

        
                
    },



    validate: function (frm) {
        if (frm.doc.tr_status === "Delivered" && !frm.confirmed) {
            frappe.validated = false;

            frappe.confirm(
                "Are you sure the entered details are correct?",
                function () {

                    frm.confirmed = true;
                    frm.save();
                    frappe.show_alert({ message: "Stock updated", indicator: "green" })
                },
                function () {

                    frappe.show_alert({ message: "Submittion Cancelled", indicator: "red" });
                }
            );
        }
    }
});
