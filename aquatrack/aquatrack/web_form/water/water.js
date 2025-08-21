

frappe.ready(function () {
    frappe.web_form.validate = () =>  {
        let phone = frappe.web_form.doc.number;
        let items_list = frappe.web_form.get_values().items || [];
        console.log(items_list)
        
        let so_items = [];
        items_list.forEach(row => {
            so_items.push({
                item_code:row.item,
                qty: row.quantity || 1,
                rate: 100,

            })
        
            
        });// ensure "number" is the exact fieldname

        // Remove previous error messages
        $('.phone-error').remove();

        if (!/^\d{10}$/.test(phone)) {
            // Show red inline message below the field
            $('[data-fieldname="number"]').closest(".form-group").append(
                `<div class="phone-error" style="color:red; margin-top:5px;">Please enter a valid 10-digit number</div>`
            );

            return false; // prevent submission
        }
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Customer",
                fields: ["name", "customer_name"],
                filters: { mobile_no: phone },
                limit: 1
            },
            callback: function (r) {
                if (r.message && r.message.length > 0) {
                    //frappe.msgprint("hoii");
                    let customer_n = r.message[0].name;
                    frappe.call({
                        method: "frappe.client.insert",
                        args: {
                            doc: {
                                doctype: "Sales Order",
                                customer: customer_n,
                                transaction_date: frappe.datetime.get_today(),
                                delivery_date: frappe.datetime.get_today(),
                                items: so_items
                                
                            }
                        },
                        callback: function (res) {
                            if (res.message) {
                                frappe.msgprint(`✅ Sales Order <b>${res.message.name}</b> created for Customer ${customer}`);
                            }
                        }
                    });


                } else {
                    frappe.msgprint("⚠️ No Customer found with this phone number. Please register first.");
                }

            }
        });




        return false;

        //allow save to continue
    };


});


