

frappe.ready(function () {

    let today = new Date();
    if(today.getDay() === 1){
        frappe.msgprint({
            title: "Notice! ",
           // indicator: "orange",
            message: "Order placed on Sunday will be delivered on Monday."
        });
    }



    frappe.web_form.validate = () =>  {
        let phone = frappe.web_form.doc.number;
       

        // Remove previous error messages
        $('.phone-error').remove();

        if (!/^\d{10}$/.test(phone)) {
            // Show red inline message below the field
            $('[data-fieldname="number"]').closest(".form-group").append(
                `<div class="phone-error" style="color:red; margin-top:5px;">Please enter a valid 10-digit number</div>`
            );

            return false; // prevent submission
        }
        
        return true;

        //allow save to continue
    };


});


