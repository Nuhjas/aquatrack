# Copyright (c) 2025, nj and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class WaterBooking(Document):
    def validate(self):

        pass

    def after_insert(self):

        if self.number:
            customer = frappe.db.get_value(
                "Customer", {"mobile_no": self.number}, "name"
            )
            if not customer:
                lead_name = f"booking_lead {frappe.db.count('Lead')+1}"
                lead = frappe.get_doc(
                    {
                        "doctype": "Lead",
                        "first_name": lead_name,
                        "mobile_no": self.number,
                        "status": "Open",
                    }
                )
                lead.insert(ignore_permissions=True)
                frappe.msgprint("Lead Created")

                return

            s_o = frappe.get_doc(
                {
                    "doctype": "Sales Order",
                    "customer": customer,
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
            frappe.msgprint("sales order created")
