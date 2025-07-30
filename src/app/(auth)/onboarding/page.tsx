"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminOnboardingPage() {
  console.log('🚨 EMERGENCY COMPONENT LOADED');

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    phone: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    try {
      const response = await fetch('/api/admin/manage/register?email=test@test.com&userId=999', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          phone: formData.phone,
          gender: formData.gender,
          role: 'admin',
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Registration successful!');
        router.push('/admin/login');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Registration failed: ' + error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>🚨 EMERGENCY ADMIN REGISTRATION</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Full Name:</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Username:</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Phone (Nigerian format):</label>
          <input
            type="text"
            placeholder="08012345678"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Gender:</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={8}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Register Admin
        </button>
      </form>
    </div>
  );
}