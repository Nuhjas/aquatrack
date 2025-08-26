# # Copyright (c) 2025, nj and contributors
# # For license information, please see license.txt


import frappe
from frappe.model.document import Document


class TripsDelivery(Document):
    def on_update(self):

        if self.tr_status == "Delivered" and not self.flags.stock_created:
            self.create_stock_entry()

        if (
            self.tr_status == "Delivered"
            and self.can_return
            and self.number_of_can_return
            and not self.flags.return_created
        ):
            self.create_can_entry()

    def create_stock_entry(self):
        stock_entry = frappe.get_doc(
            {
                "doctype": "Stock Entry",
                "stock_entry_type": "Material Transfer",
            }
        )

        for row in self.items:
            stock_entry.append(
                "items",
                {
                    "item_code": row.item_code,
                    "qty": row.quantity,
                    "rate": 100,
                    "t_warehouse": "water house - A",
                    "s_warehouse": "Stores - A",
                },
            )

        stock_entry.insert()
        stock_entry.submit()
        self.flags.stock_created = True

    def create_can_entry(self):
        stock_entry = frappe.get_doc(
            {
                "doctype": "Stock Entry",
                "stock_entry_type": "Material Transfer",
            }
        )

        stock_entry.append(
            "items",
            {
                "item_code": "EC1",
                "qty": self.number_of_can_return,
                "t_warehouse": "Stores - A",
                "s_warehouse": "water house - A"
            },
        )

        stock_entry.insert()
        stock_entry.submit()
        self.flags.return_created = True
        frappe.msgprint("return")
