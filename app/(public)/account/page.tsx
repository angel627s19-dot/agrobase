'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  Package,
  MapPin,
  Lock,
  LogOut,
  Building,
  Phone,
  Mail,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  ExternalLink,
  MessageCircle,
  Calendar,
  Clock,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { formatPrice } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';

function AccountPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';

  const { customer, isAuthenticated, isLoading, checkAuth, logout, setCustomer } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'security'>('profile');

  // Sync with tab URL query
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'orders' || tabParam === 'addresses' || tabParam === 'security' || tabParam === 'profile') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Addresses State
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('Maharashtra');
  const [newPincode, setNewPincode] = useState('');
  const [newIsDefault, setNewIsDefault] = useState(false);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBusiness, setEditBusiness] = useState('');
  const [editUserType, setEditUserType] = useState('Farmer');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Security / Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Set edit form values when customer loads
  useEffect(() => {
    if (customer) {
      setEditName(customer.name || '');
      setEditPhone(customer.phone || '');
      setEditEmail(customer.email || '');
      setEditBusiness(customer.businessName || '');
      setEditUserType(customer.userType || 'Farmer');
    }
  }, [customer]);

  // Redirect if not authenticated after loading
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/customer/orders');
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch addresses
  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res = await fetch('/api/customer/addresses');
      const data = await res.json();
      if (data.success && Array.isArray(data.addresses)) {
        setAddresses(data.addresses);
      }
    } catch (e) {
      console.error('Failed to fetch addresses:', e);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'addresses') fetchAddresses();
    }
  }, [isAuthenticated, activeTab]);

  // Save profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);

    try {
      const res = await fetch('/api/auth/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          email: editEmail,
          businessName: editBusiness,
          userType: editUserType,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCustomer({ ...customer!, ...data.customer });
        setProfileMessage({ type: 'success', text: 'Profile details updated successfully!' });
        setIsEditingProfile(false);
      } else {
        setProfileMessage({ type: 'error', text: data.message || 'Failed to update profile.' });
      }
    } catch (err) {
      setProfileMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setProfileSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      setPasswordSaving(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      setPasswordSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/customer/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword: confirmNewPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setPasswordMessage({ type: 'error', text: data.message || 'Failed to change password.' });
      }
    } catch (err) {
      setPasswordMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  // Add address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/customer/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: newStreet,
          city: newCity,
          state: newState,
          pincode: newPincode,
          isDefault: newIsDefault,
        }),
      });
      const data = await res.json();
      if (data.success && data.address) {
        setShowAddressModal(false);
        setNewStreet('');
        setNewCity('');
        setNewPincode('');
        fetchAddresses();
      }
    } catch (e) {
      console.error('Error adding address:', e);
    }
  };

  // Delete address
  const handleDeleteAddress = async (id: string) => {
    try {
      await fetch(`/api/customer/addresses?id=${id}`, { method: 'DELETE' });
      fetchAddresses();
    } catch (e) {
      console.error('Error deleting address:', e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-green-700" />
          <p className="text-xs text-gray-500 font-medium">Loading your Agro Base account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !customer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        
        {/* Top Profile Summary Card */}
        <div className="bg-gradient-to-r from-[#1E5631] via-[#24673c] to-[#1E5631] text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl shadow-inner shrink-0">
              {customer.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight">
                  {customer.name}
                </h1>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-gray-900 shadow-sm">
                  {customer.userType || 'Farmer'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1 flex items-center gap-2 flex-wrap">
                <span>📱 +91 {customer.phone}</span>
                {customer.email && <span>• ✉️ {customer.email}</span>}
                {customer.businessName && <span>• 🏢 {customer.businessName}</span>}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dashboard Layout: Tabs + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#1E5631] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#1E5631] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-[#1E5631] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-[#1E5631] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Security & Password</span>
              </button>
            </div>

            {/* Quick Contact Card */}
            <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5 text-xs text-emerald-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Direct WhatsApp Support</span>
              </div>
              <p className="text-emerald-700 leading-relaxed">
                Need urgent bulk supplies or dispatch status? Contact our manager directly.
              </p>
              <a
                href={`https://wa.me/917249621323?text=${encodeURIComponent(`Hello Agro Base, I am logged in as ${customer.name} (Phone: ${customer.phone}). I need assistance.`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 font-bold text-emerald-800 hover:underline"
              >
                Chat on WhatsApp (+91 7249621323) →
              </a>
            </div>
          </div>

          {/* Main Tab Content */}
          <div className="lg:col-span-3">

            {/* TAB 1: PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-xl font-heading font-bold text-gray-900">Personal & Business Details</h2>
                    <p className="text-xs text-gray-500">Manage your contact information and customer role.</p>
                  </div>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>
                  )}
                </div>

                {profileMessage && (
                  <div
                    className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                      profileMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {profileMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{profileMessage.text}</span>
                  </div>
                )}

                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          required
                          className="w-full h-11 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Customer / User Type</label>
                        <select
                          value={editUserType}
                          onChange={(e) => setEditUserType(e.target.value)}
                          className="w-full h-11 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        >
                          <option value="Farmer">Farmer (Cultivator)</option>
                          <option value="Dealer">Agro Dealer</option>
                          <option value="Distributor">Distributor / Stockist</option>
                          <option value="Retailer">Retail Store Owner</option>
                          <option value="Wholesaler">Bulk Wholesaler</option>
                          <option value="Individual Customer">Individual Customer</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mobile Number</label>
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          required
                          maxLength={10}
                          className="w-full h-11 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full h-11 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Business / Farm Name</label>
                      <input
                        type="text"
                        value={editBusiness}
                        onChange={(e) => setEditBusiness(e.target.value)}
                        placeholder="e.g. Patil Farms"
                        className="w-full h-11 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={profileSaving}
                        className="px-6 py-2.5 rounded-xl bg-[#1E5631] hover:bg-[#164326] text-white text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <span className="text-xs text-gray-400 font-semibold uppercase">Full Name</span>
                      <p className="text-base font-bold text-gray-900 mt-1">{customer.name}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <span className="text-xs text-gray-400 font-semibold uppercase">Customer Category</span>
                      <p className="text-base font-bold text-[#1E5631] mt-1">{customer.userType || 'Farmer'}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <span className="text-xs text-gray-400 font-semibold uppercase">Mobile Number</span>
                      <p className="text-base font-bold text-gray-900 mt-1 font-mono">+91 {customer.phone}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <span className="text-xs text-gray-400 font-semibold uppercase">Email Address</span>
                      <p className="text-base font-bold text-gray-900 mt-1">{customer.email || 'Not provided'}</p>
                    </div>

                    <div className="sm:col-span-2 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <span className="text-xs text-gray-400 font-semibold uppercase">Business / Farm Name</span>
                      <p className="text-base font-bold text-gray-900 mt-1">{customer.businessName || 'Individual Cultivator'}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ORDERS */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-xl font-heading font-bold text-gray-900">Order History & Tracking</h2>
                  <p className="text-xs text-gray-500">Track current dispatches and review previous orders.</p>
                </div>

                {loadingOrders ? (
                  <div className="py-12 flex justify-center">
                    <Loader2 className="w-7 h-7 animate-spin text-brand-green-700" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                      <Package className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base">No Orders Placed Yet</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      Explore our catalog of irrigation pipes, drip laterals, and agricultural fittings.
                    </p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E5631] text-white text-xs font-bold hover:bg-[#164326] transition-colors cursor-pointer mt-2"
                    >
                      <span>Browse Products</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div key={ord.id} className="border border-gray-200 rounded-2xl p-5 hover:border-brand-green-500 transition-colors">
                        <div className="flex items-start justify-between flex-wrap gap-2 border-b border-gray-100 pb-3">
                          <div>
                            <span className="font-mono font-bold text-brand-green-800 text-sm">#{ord.orderNumber}</span>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            ord.status === 'READY' || ord.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.status}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="py-3 space-y-2">
                          {ord.items?.map((it: any) => (
                            <div key={it.id} className="flex justify-between items-center text-xs">
                              <span className="font-medium text-gray-800">
                                {it.product?.name || 'Agri Supply Item'} × {it.quantity}
                              </span>
                              <span className="font-semibold text-gray-900">{formatPrice(it.price * it.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                          <span className="font-bold text-gray-700">Total: {formatPrice(ord.total)}</span>
                          <a
                            href={`https://wa.me/917249621323?text=${encodeURIComponent(`Hello Agro Base, I am inquiring about Order #${ord.orderNumber}.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-emerald-700 font-bold hover:underline"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                            <span>Track on WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-xl font-heading font-bold text-gray-900">Saved Delivery Addresses</h2>
                    <p className="text-xs text-gray-500">Addresses for farm and store dispatches.</p>
                  </div>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E5631] hover:bg-[#164326] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Address</span>
                  </button>
                </div>

                {loadingAddresses ? (
                  <div className="py-12 flex justify-center">
                    <Loader2 className="w-7 h-7 animate-spin text-brand-green-700" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <MapPin className="w-10 h-10 text-gray-300 mx-auto" />
                    <p className="text-sm font-semibold text-gray-700">No saved addresses yet</p>
                    <p className="text-xs text-gray-400">Add a delivery address for quicker ordering.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="p-4 rounded-2xl border border-gray-200 relative bg-gray-50 flex flex-col justify-between">
                        <div>
                          {addr.isDefault && (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 mb-2">
                              Default Address
                            </span>
                          )}
                          <p className="text-sm font-semibold text-gray-900 leading-snug">{addr.address}</p>
                          <p className="text-xs text-gray-600 mt-1">{addr.city}, {addr.state} - {addr.pincode}</p>
                        </div>
                        <div className="pt-3 flex justify-end">
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Delete Address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Address Modal */}
                {showAddressModal && (
                  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
                      <h3 className="font-bold text-lg text-gray-900">Add New Delivery Address</h3>
                      <form onSubmit={handleAddAddress} className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Street / Farm Address</label>
                          <input
                            type="text"
                            value={newStreet}
                            onChange={(e) => setNewStreet(e.target.value)}
                            required
                            placeholder="Plot 14, Near Mahaveer Nagar"
                            className="w-full h-10 px-3 border rounded-xl text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">City / Town</label>
                            <input
                              type="text"
                              value={newCity}
                              onChange={(e) => setNewCity(e.target.value)}
                              required
                              placeholder="Sangli"
                              className="w-full h-10 px-3 border rounded-xl text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Pincode</label>
                            <input
                              type="text"
                              value={newPincode}
                              onChange={(e) => setNewPincode(e.target.value)}
                              required
                              placeholder="416416"
                              className="w-full h-10 px-3 border rounded-xl text-sm font-mono"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                          <input
                            type="text"
                            value={newState}
                            onChange={(e) => setNewState(e.target.value)}
                            required
                            className="w-full h-10 px-3 border rounded-xl text-sm"
                          />
                        </div>
                        <label className="flex items-center gap-2 text-xs text-gray-600 pt-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newIsDefault}
                            onChange={(e) => setNewIsDefault(e.target.checked)}
                          />
                          <span>Set as default delivery address</span>
                        </label>
                        <div className="flex gap-2.5 pt-3">
                          <button
                            type="button"
                            onClick={() => setShowAddressModal(false)}
                            className="w-1/2 h-10 border rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="w-1/2 h-10 bg-[#1E5631] text-white rounded-xl text-xs font-bold hover:bg-[#164326] cursor-pointer"
                          >
                            Save Address
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SECURITY */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-xl font-heading font-bold text-gray-900">Security & Password</h2>
                  <p className="text-xs text-gray-500">Update your account password and security credentials.</p>
                </div>

                {passwordMessage && (
                  <div
                    className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                      passwordMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {passwordMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{passwordMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full h-11 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Min. 6 characters"
                      className="w-full h-11 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                      placeholder="Re-enter new password"
                      className="w-full h-11 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="h-11 px-6 bg-[#1E5631] hover:bg-[#164326] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <React.Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-green-700" />
        </div>
      }
    >
      <AccountPageInner />
    </React.Suspense>
  );
}
