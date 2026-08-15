import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  UserPlus, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Search, 
  Edit3, 
  Eye, 
  EyeOff, 
  KeyRound 
} from 'lucide-react';

export const AdminUserPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([
    {
      id: '1',
      name: 'Super Admin',
      email: 'admin@eduai.com',
      role: 'admin',
      isActive: true,
      createdAt: '2026-01-01',
    },
    {
      id: '2',
      name: 'Budi Santoso, S.Pd',
      email: 'guru@eduai.com',
      role: 'guru',
      schoolName: 'SMP Negeri 1 Yogyakarta',
      isActive: true,
      expiresAt: '2026-12-31',
      createdAt: '2026-02-15',
    },
  ]);

  const [search, setSearch] = useState('');
  
  // State Modal Tambah/Edit User
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // State Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle Password Visibility
  const [schoolName, setSchoolName] = useState('');
  const [role, setRole] = useState<'admin' | 'guru'>('guru');

  // Buka Modal Tambah User Baru
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setSchoolName('');
    setRole('guru');
    setShowModal(true);
  };

  // Buka Modal Edit User
  const handleOpenEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword(''); // Kosongkan password (hanya diisi jika ingin diubah)
    setShowPassword(false);
    setSchoolName(user.schoolName || '');
    setRole(user.role);
    setShowModal(true);
  };

  // Simpan Data (Bisa Tambah Baru atau Update)
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      // EDIT USER YANG SUDAH ADA
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name,
                email,
                schoolName,
                role,
              }
            : u
        )
      );
      if (password) {
        // Logika simpan password baru jika diisi saat edit
        console.log(`Password pengguna ${editingUser.name} berhasil diperbarui.`);
      }
    } else {
      // TAMBAH USER BARU
      const newUser: UserProfile = {
        id: Date.now().toString(),
        name,
        email,
        role,
        schoolName,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser]);
    }

    setShowModal(false);
  };

  // Toggle Status Langganan (Aktif / Nonaktif)
  const toggleStatus = (id: string) => {
    setUsers(
      users.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.schoolName && u.schoolName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Panel Administrator</span>
          </div>
          <h1 className="text-2xl font-black">Manajemen Pengguna & Lisensi</h1>
          <p className="text-xs text-slate-300">
            Kelola akun guru, edit profil, reset password, dan atur status langganan secara real-time.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* Bar Pencarian */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan nama, email, atau sekolah..."
          className="w-full text-xs outline-none font-medium text-slate-700"
        />
      </div>

      {/* Tabel Pengguna */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-600 uppercase">
              <th className="p-4">Pengguna</th>
              <th className="p-4">Sekolah</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status Langganan</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition">
                <td className="p-4">
                  <div className="font-bold text-slate-800">{u.name}</div>
                  <div className="text-[11px] text-slate-400">{u.email}</div>
                </td>
                <td className="p-4">{u.schoolName || '-'}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      u.isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {u.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span>{u.isActive ? 'Berlangganan Aktif' : 'Nonaktif / Expired'}</span>
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {/* Tombol Edit Profil / Password */}
                    <button
                      onClick={() => handleOpenEditModal(u)}
                      title="Edit Nama, Profil & Password"
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* Tombol Toggle Aktif / Nonaktif */}
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        u.isActive
                          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      {u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form Tambah / Edit User */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h2 className="text-lg font-black text-slate-800">
              {editingUser ? 'Edit Profil & Password Pengguna' : 'Tambah Akun Pengguna Baru'}
            </h2>

            <form onSubmit={handleSaveUser} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Ani Rahmawati, S.Pd"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Email Login</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ani@sekolah.sch.id"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* Input Password + Toggle Visibility */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center justify-between">
                  <span>
                    {editingUser ? 'Password Baru (Opsional)' : 'Password *'}
                  </span>
                  {editingUser && (
                    <span className="text-[10px] font-normal text-slate-400">
                      Kosongkan jika tidak diubah
                    </span>
                  )}
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={!editingUser}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={editingUser ? 'Ketik untuk mengganti password' : 'Masukkan password awal'}
                    className="w-full p-2.5 pr-10 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 transition"
                    title={showPassword ? 'Sembunyikan Password' : 'Tampilkan Password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nama Sekolah</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Contoh: SLB Negeri 1 / SD IT Al-Azhar"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Role / Peran</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'guru')}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none font-bold"
                >
                  <option value="guru">Guru (Pengguna Biasa)</option>
                  <option value="admin">Admin (Pengelola Lisensi)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-black bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{editingUser ? 'Simpan Perubahan' : 'Simpan Akun Baru'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};