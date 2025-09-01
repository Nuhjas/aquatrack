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
			and any(row.number_of_can_return for row in self.items)
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
			print(f"Adding item {row.item_code} with qty {row.quantity}")
			stock_entry.append(
				"items",
				{
					"item_code": row.item_code,
					"qty": row.quantity,
					"s_warehouse": "water house - A",
					"t_warehouse": self.warehouse_customer,
				},
			)

		stock_entry.insert()
		stock_entry.submit()
		self.flags.stock_created = True

		self.stock_update()

	def create_can_entry(self):
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
					"qty": row.number_of_can_return,
					"s_warehouse": self.warehouse_customer,
					"t_warehouse": "water house - A",
				},
			)

		stock_entry.insert()
		stock_entry.submit()
		self.flags.return_created = True

		self.stock_update()

	def stock_update(self):
		if self.customer_name and self.warehouse_customer:
			stock_line = []

			stock = frappe.db.get_all(
				"Bin", filters={"warehouse": self.warehouse_customer}, fields=["item_code", "actual_qty"]
			)

			for i in stock:
				stock_line.append(f"{i.item_code}: {i.actual_qty}")

			stock_text = "\n".join(stock_line)

			frappe.db.set_value("Customer", self.customer_name, "custom_stock", stock_text)
