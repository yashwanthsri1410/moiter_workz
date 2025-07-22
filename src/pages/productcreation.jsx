import React, { useEffect, useState } from "react";
import axios from "axios";
import usePublicIp from "../hooks/usePublicIp";
import { PencilIcon, Search } from "lucide-react";

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);
    const [form, setForm] = useState({
        productName: "",
        productType: "Fleet Card",
        description: "",
        isActive: true,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const ip = usePublicIp();
    const username = localStorage.getItem("username");

    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://192.168.22.247:7090/api/Export/product_export");
            setProducts(res.data || []);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async () => {
        const { productName, productType, description } = form;
        if (!productName.trim() || !productType.trim()) {
            alert("Product Name and Type are required.");
            return;
        }

        const duplicate = products.some(
            (p) => p.productName.toLowerCase() === productName.toLowerCase()
        );
        if (duplicate) {
            alert("Product already exists.");
            return;
        }

        const now = new Date().toISOString();
        const payload = {
            ...form,
            metadata: {
                ipAddress: ip,
                userAgent: navigator.userAgent,
                headers: "application/json",
                channel: "web",
                auditMetadata: {
                    createdBy: username,
                    createdDate: now,
                    modifiedBy: username,
                    modifiedDate: now,
                    header: {
                        additionalProp1: {
                            options: { propertyNameCaseInsensitive: true },
                            parent: "web",
                            root: "web",
                        },
                        additionalProp2: {
                            options: { propertyNameCaseInsensitive: true },
                            parent: "web",
                            root: "web",
                        },
                        additionalProp3: {
                            options: { propertyNameCaseInsensitive: true },
                            parent: "web",
                            root: "web",
                        },
                    },
                },
            },
        };

        try {
            axios.post("http://192.168.22.247:5252/createProduct", payload, {
                withCredentials: true
            });
            alert("Product created successfully!");
            setForm({ productName: "", productType: "Fleet Card", description: "", isActive: true });
            fetchProducts();
        } catch (err) {
            alert("Error creating product.");
            console.error(err);
        }
    };

    const handleUpdate = async (productId) => {
        const now = new Date().toISOString();
        const payload = {
            ...form,
            productId,
            metadata: {
                ipAddress: ip,
                userAgent: navigator.userAgent,
                headers: "application/json",
                channel: "web",
                auditMetadata: {
                    createdBy: username,
                    createdDate: now,
                    modifiedBy: username,
                    modifiedDate: now,
                    header: {
                        additionalProp1: {
                            options: { propertyNameCaseInsensitive: true },
                            parent: "web",
                            root: "web",
                        },
                        additionalProp2: {
                            options: { propertyNameCaseInsensitive: true },
                            parent: "web",
                            root: "web",
                        },
                        additionalProp3: {
                            options: { propertyNameCaseInsensitive: true },
                            parent: "web",
                            root: "web",
                        },
                    },
                },
            },
        };

        try {
            await axios.put("http://192.168.22.247:5252/updateProductById", payload);
            console.log("????????",payload         )
            alert("Product updated successfully.");
            setEditingProductId(null);
            setForm({ productName: "", productType: "Fleet Card", description: "", isActive: true });
            fetchProducts();
        } catch (err) {
            alert("Error updating product.");
            console.error(err);
        }
    };

    const filtered = products.filter((p) =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#060e1f] p-6 text-white">
            <div className="max-w-6xl mx-auto bg-[#0a132f] p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Product Management</h2>

                <div className="grid grid-cols-1 gap-4 mb-4">
  <input
    name="productName"
    value={form.productName}
    onChange={handleChange}
    placeholder="Product Name"
    className="px-4 py-2 rounded-md bg-[#131c3a] border border-gray-600"
  />
  
  <select
    name="productType"
    value={form.productType}
    onChange={handleChange}
    className="px-4 py-2 rounded-md bg-[#131c3a] border border-gray-600"
  >
    <option value="Fleet Card">Fleet Card</option>
    <option value="Gift Card">Gift Card</option>
    <option value="Meal Card">Meal Card</option>
    <option value="Travel Card">Travel Card</option>
  </select>
  
  <input
    name="description"
    value={form.description}
    onChange={handleChange}
    placeholder="Description"
    className="px-4 py-2 rounded-md bg-[#131c3a] border border-gray-600"
  />
  
  <label className="flex items-center gap-2 text-sm">
    <input
      type="checkbox"
      name="isActive"
      checked={form.isActive}
      onChange={handleChange}
    />
    Active
  </label>
</div>


                <button
                    onClick={editingProductId ? () => handleUpdate(editingProductId) : handleSubmit}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 mb-6 rounded-md"
                >
                    {editingProductId ? "Update Product" : "Create Product"}
                </button>

                <div className="mb-4 relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products..."
                        className="pl-10 pr-4 py-2 w-full rounded-md bg-[#131c3a] border border-gray-600 placeholder-gray-400"
                    />
                </div>

                <table className="min-w-full text-sm">
                    <thead className="bg-[#0f1a37] text-left text-gray-400">
                        <tr>
                            <th className="py-2 px-4">#</th>
                            <th className="py-2 px-4">Name</th>
                            <th className="py-2 px-4">Type</th>
                            <th className="py-2 px-4">Description</th>
                            <th className="py-2 px-4">Status</th>
                            <th className="py-2 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? (
                            filtered.map((p, idx) => (
                                <tr key={p.productId} className="border-t border-[#1d2b4f]">
                                    <td className="py-2 px-4">{p.productId}</td>
                                    <td className="py-2 px-4">{p.productName}</td>
                                    <td className="py-2 px-4">{p.productType}</td>
                                    <td className="py-2 px-4">{p.description}</td>
                                    <td className="py-2 px-4">{p.isActive ? "Active" : "Inactive"}</td>
                                    <td className="py-2 px-4">
                                        <button
                                            onClick={() => {
                                                setEditingProductId(p.productId);
                                                setForm({
                                                    productName: p.productName,
                                                    productType: p.productType,
                                                    description: p.description,
                                                    isActive: p.isActive,
                                                });
                                            }}
                                            className="text-blue-500 hover:underline flex items-center gap-2"
                                        >
                                            <PencilIcon className="w-4 h-4" /> Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
