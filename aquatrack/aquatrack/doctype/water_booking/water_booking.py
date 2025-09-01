# Copyright (c) 2025, nj and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class WaterBooking(Document):
    def validate(self):

        pass

    def after_insert(self):

        phone = self.number
        customer = frappe.db.get_all("Customer", {"mobile_no": phone}, "name")

        if customer:
            customer_doc = customer[0]
            customer_n = customer_doc.name
        else:

            lead_name = f"booking_lead {frappe.db.count('Lead')+1}"
            lead = frappe.get_doc(
                {
                    "doctype": "Lead",
                    "first_name": lead_name,
                    "mobile_no": phone,
                    "status": "Open",
                }
            )
            lead.insert(ignore_permissions=True)
            #frappe.msgprint("Lead Created")

            return

        s_o = frappe.get_doc(
            {
                "doctype": "Sales Order",
                "customer": customer_n,
                "transaction_date": frappe.utils.nowdate(),
                "delivery_date": frappe.utils.nowdate(),
                "items": [],
            }
        )

        for row in self.items:
            s_o.append(
                "items",
                {"item_code": row.item, "qty": row.quantity or 1, "rate": 100},
            )

        s_o.insert(ignore_permissions=True)
        #frappe.msgprint("sales order created")

        t_d = frappe.get_doc({
            "doctype": "Trips Delivery",
            "customer_name": customer_n,
            "mobile_number": phone,
            "items": []
        })

        for row in self.items:
            t_d.append(
                "items",
                {"item_code": row.item, "quantity":row.quantity or 1, "delivery_date":frappe.utils.nowdate()}
            )

        t_d.insert(ignore_permissions=True)
        #frappe.msgprint("trip created")
