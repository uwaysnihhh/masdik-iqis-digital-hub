import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  Wallet,
  FileText,
  Check,
  X,
  Clock,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  ArrowLeft,
  LogOut,
  Eye,
  Menu,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

// Sample Data
type BookingStatus = "pending" | "approved" | "rejected";

interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  activity: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  description: string;
  status: BookingStatus;
}

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  description: string;
}

const bookingRequests: Booking[] = [
  {
    id: "1",
    name: "Ahmad Fauzi",
    phone: "081234567890",
    email: "ahmad@email.com",
    activity: "Akad Nikah",
    date: "2024-12-20",
    timeStart: "08:00",
    timeEnd: "12:00",
    description: "Acara akad nikah untuk keluarga Ahmad dan Siti",
    status: "pending",
  },
  {
    id: "2",
    name: "Siti Aminah",
    phone: "081234567891",
    email: "siti@email.com",
    activity: "Pengajian",
    date: "2024-12-18",
    timeStart: "16:00",
    timeEnd: "18:00",
    description: "Pengajian rutin bulanan ibu-ibu",
    status: "approved",
  },
  {
    id: "3",
    name: "Budi Santoso",
    phone: "081234567892",
    email: "budi@email.com",
    activity: "Aqiqah",
    date: "2024-12-25",
    timeStart: "09:00",
    timeEnd: "14:00",
    description: "Acara aqiqah anak pertama",
    status: "pending",
  },
];

const initialTransactions: Transaction[] = [
  { id: "1", type: "income", amount: 5000000, description: "Donasi Jumat", date: "2024-12-13" },
  { id: "2", type: "expense", amount: 1500000, description: "Pembayaran Listrik", date: "2024-12-10" },
  { id: "3", type: "income", amount: 2500000, description: "Infaq Bulanan", date: "2024-12-05" },
];

const initialEvents: Event[] = [
  { id: "1", title: "Kajian Subuh", date: "2024-12-18", time: "05:30", type: "kajian", description: "Kajian subuh bersama ustadz" },
  { id: "2", title: "Pengajian Bulanan", date: "2024-12-20", time: "16:00", type: "pengajian", description: "Pengajian rutin bulanan" },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function Admin() {
  const [bookings, setBookings] = useState<Booking[]>(bookingRequests);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();

  // Transaction form state
  const [txType, setTxType] = useState<"income" | "expense">("income");
  const [txAmount, setTxAmount] = useState("");
  const [txDescription, setTxDescription] = useState("");
  const [txDate, setTxDate] = useState("");
  const [txDialogOpen, setTxDialogOpen] = useState(false);

  // Event form state
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventType, setEventType] = useState("kajian");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDialogOpen, setEventDialogOpen] = useState(false);

  // View booking dialog
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);

  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin-login");
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin-login");
    toast({ title: "Logout Berhasil" });
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <ShieldAlert className="w-16 h-16 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-bold mb-2">Akses Ditolak</h2>
            <p className="text-muted-foreground mb-4">
              Anda tidak memiliki izin untuk mengakses halaman admin.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => navigate("/")}>
                Kembali ke Beranda
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleApprove = (id: string) => {
    setBookings(
      bookings.map((b): Booking => (b.id === id ? { ...b, status: "approved" } : b))
    );
    toast({ title: "Reservasi Disetujui", description: "Notifikasi telah dikirim ke pemohon" });
  };

  const handleReject = (id: string) => {
    setBookings(
      bookings.map((b): Booking => (b.id === id ? { ...b, status: "rejected" } : b))
    );
    toast({ title: "Reservasi Ditolak", variant: "destructive" });
  };

  const handleAddTransaction = () => {
    if (!txAmount || !txDescription || !txDate) {
      toast({ title: "Lengkapi semua field", variant: "destructive" });
      return;
    }
    const newTx: Transaction = {
      id: Date.now().toString(),
      type: txType,
      amount: parseInt(txAmount),
      description: txDescription,
      date: txDate,
    };
    setTransactions([newTx, ...transactions]);
    setTxAmount("");
    setTxDescription("");
    setTxDate("");
    setTxDialogOpen(false);
    toast({ title: "Transaksi Ditambahkan" });
  };

  const handleAddEvent = () => {
    if (!eventTitle || !eventDate || !eventTime) {
      toast({ title: "Lengkapi semua field", variant: "destructive" });
      return;
    }
    const newEvent: Event = {
      id: Date.now().toString(),
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      type: eventType,
      description: eventDescription,
    };
    setEvents([newEvent, ...events]);
    setEventTitle("");
    setEventDate("");
    setEventTime("");
    setEventType("kajian");
    setEventDescription("");
    setEventDialogOpen(false);
    toast({ title: "Kegiatan Ditambahkan" });
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const [statDialogOpen, setStatDialogOpen] = useState<string | null>(null);

  const pendingBookings = bookings.filter((b) => b.status === "pending");

  const stats = [
    {
      id: "saldo",
      title: "Total Saldo",
      value: formatCurrency(45750000),
      icon: Wallet,
      trend: "+12%",
      trendUp: true,
    },
    {
      id: "pemasukan",
      title: "Total Pemasukan",
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      trend: "+25%",
      trendUp: true,
    },
    {
      id: "pengeluaran",
      title: "Total Pengeluaran",
      value: formatCurrency(totalExpense),
      icon: TrendingDown,
      trend: "-8%",
      trendUp: false,
    },
    {
      id: "reservasi",
      title: "Reservasi Pending",
      value: pendingBookings.length.toString(),
      icon: Clock,
      trend: "Butuh tindakan",
      trendUp: null,
    },
    {
      id: "kegiatan",
      title: "Kegiatan Bulan Ini",
      value: events.length.toString(),
      icon: CalendarDays,
      trend: "+3",
      trendUp: true,
    },
  ];

  const incomeTransactions = transactions.filter((t) => t.type === "income");
  const expenseTransactions = transactions.filter((t) => t.type === "expense");

  const renderStatDialogContent = (statId: string) => {
    switch (statId) {
      case "saldo":
        return (
          <div className="space-y-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Saldo Saat Ini</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(45750000)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-muted-foreground">Total Pemasukan</p>
                <p className="text-lg font-semibold text-green-600">{formatCurrency(totalIncome)}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-muted-foreground">Total Pengeluaran</p>
                <p className="text-lg font-semibold text-red-600">{formatCurrency(totalExpense)}</p>
              </div>
            </div>
          </div>
        );
      case "pemasukan":
        return (
          <div className="space-y-3">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Pemasukan</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {incomeTransactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <p className="font-semibold text-green-600">{formatCurrency(tx.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "pengeluaran":
        return (
          <div className="space-y-3">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
              <p className="text-3xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {expenseTransactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <p className="font-semibold text-red-600">{formatCurrency(tx.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "reservasi":
        return (
          <div className="space-y-3">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Reservasi Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingBookings.length}</p>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {pendingBookings.length > 0 ? pendingBookings.map((booking) => (
                <div key={booking.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{booking.name}</p>
                      <p className="text-xs text-muted-foreground">{booking.activity}</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {booking.date} • {booking.timeStart} - {booking.timeEnd}
                  </p>
                </div>
              )) : (
                <p className="text-center text-muted-foreground py-4">Tidak ada reservasi pending</p>
              )}
            </div>
          </div>
        );
      case "kegiatan":
        return (
          <div className="space-y-3">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Kegiatan Bulan Ini</p>
              <p className="text-3xl font-bold text-primary">{events.length}</p>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {events.length > 0 ? events.map((event) => (
                <div key={event.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.description}</p>
                    </div>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {event.date} • {event.time}
                  </p>
                </div>
              )) : (
                <p className="text-center text-muted-foreground py-4">Tidak ada kegiatan bulan ini</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div className="h-8 w-px bg-border" />
              <div>
                <h1 className="font-bold text-foreground">Admin</h1>
                <p className="text-xs text-muted-foreground">MASDIK IQIS</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden">
            <div className="flex items-center justify-between">
              <Link to="/">
                <Button variant="ghost" size="sm" className="px-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="text-center">
                <h1 className="font-bold text-foreground text-sm">Admin</h1>
                <p className="text-xs text-muted-foreground">MASDIK IQIS</p>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="px-2"
                  onClick={() => setShowMobileSearch(!showMobileSearch)}
                >
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="px-2" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {showMobileSearch && (
              <div className="mt-3">
                <Input
                  placeholder="Cari..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
          {stats.map((stat, index) => (
            <Dialog key={index} open={statDialogOpen === stat.id} onOpenChange={(open) => setStatDialogOpen(open ? stat.id : null)}>
              <DialogTrigger asChild>
                <Card className="border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">{stat.title}</p>
                        <p className="text-lg md:text-2xl font-bold text-foreground truncate">{stat.value}</p>
                        {stat.trendUp !== null && (
                          <p
                            className={cn(
                              "text-xs mt-1 flex items-center gap-1",
                              stat.trendUp ? "text-primary" : "text-destructive"
                            )}
                          >
                            {stat.trendUp ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {stat.trend}
                          </p>
                        )}
                        {stat.trendUp === null && (
                          <p className="text-xs mt-1 text-yellow-600">{stat.trend}</p>
                        )}
                      </div>
                      <div className="w-10 h-10 md:w-12 md:h-12 gradient-islamic rounded-xl flex items-center justify-center shrink-0 ml-2">
                        <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <stat.icon className="w-5 h-5" />
                    {stat.title}
                  </DialogTitle>
                </DialogHeader>
                {renderStatDialogContent(stat.id)}
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="reservations" className="space-y-4 md:space-y-6">
          <TabsList className="bg-card shadow-lg w-full md:w-auto overflow-x-auto">
            <TabsTrigger value="reservations" className="gap-1 md:gap-2 text-xs md:text-sm">
              <FileText className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Reservasi</span>
              <span className="sm:hidden">Rsv</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-1 md:gap-2 text-xs md:text-sm">
              <Wallet className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Transaksi</span>
              <span className="sm:hidden">Trx</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-1 md:gap-2 text-xs md:text-sm">
              <CalendarDays className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Kegiatan</span>
              <span className="sm:hidden">Keg</span>
            </TabsTrigger>
          </TabsList>

          {/* Reservations Tab */}
          <TabsContent value="reservations">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base md:text-lg">Daftar Reservasi</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead className="hidden md:table-cell">Telepon</TableHead>
                      <TableHead>Kegiatan</TableHead>
                      <TableHead className="hidden sm:table-cell">Tanggal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium text-sm">{booking.name}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{booking.phone}</TableCell>
                        <TableCell className="text-sm">{booking.activity}</TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">{booking.date}</TableCell>
                        <TableCell>
                          <Badge className={cn(statusColors[booking.status], "text-xs")}>
                            {statusLabels[booking.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 md:gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setViewBooking(booking)}
                                  className="px-2"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Detail Reservasi</DialogTitle>
                                </DialogHeader>
                                {viewBooking && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-muted-foreground text-xs">Nama</Label>
                                        <p className="font-medium">{viewBooking.name}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground text-xs">Telepon</Label>
                                        <p className="font-medium">{viewBooking.phone}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground text-xs">Email</Label>
                                        <p className="font-medium">{viewBooking.email}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground text-xs">Kegiatan</Label>
                                        <p className="font-medium">{viewBooking.activity}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground text-xs">Tanggal</Label>
                                        <p className="font-medium">{viewBooking.date}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground text-xs">Waktu</Label>
                                        <p className="font-medium">{viewBooking.timeStart} - {viewBooking.timeEnd}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground text-xs">Keterangan</Label>
                                      <p className="font-medium">{viewBooking.description}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground text-xs">Status</Label>
                                      <Badge className={statusColors[viewBooking.status]}>
                                        {statusLabels[viewBooking.status]}
                                      </Badge>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            {booking.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleApprove(booking.id)}
                                  className="px-2"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(booking.id)}
                                  className="px-2"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base md:text-lg">Riwayat Transaksi</CardTitle>
                <Dialog open={txDialogOpen} onOpenChange={setTxDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="islamic">
                      <Plus className="w-4 h-4 mr-1 md:mr-2" />
                      <span className="hidden sm:inline">Tambah Transaksi</span>
                      <span className="sm:hidden">Tambah</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Transaksi</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Tipe Transaksi</Label>
                        <Select value={txType} onValueChange={(v) => setTxType(v as "income" | "expense")}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income">Pemasukan</SelectItem>
                            <SelectItem value="expense">Pengeluaran</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Jumlah (Rp)</Label>
                        <Input 
                          type="number" 
                          placeholder="1000000" 
                          value={txAmount}
                          onChange={(e) => setTxAmount(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Deskripsi</Label>
                        <Input 
                          placeholder="Donasi Jumat" 
                          value={txDescription}
                          onChange={(e) => setTxDescription(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Tanggal</Label>
                        <Input 
                          type="date" 
                          value={txDate}
                          onChange={(e) => setTxDate(e.target.value)}
                        />
                      </div>
                      <Button variant="islamic" className="w-full" onClick={handleAddTransaction}>
                        Simpan Transaksi
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead className="hidden sm:table-cell">Tipe</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="text-sm">{tx.date}</TableCell>
                        <TableCell className="font-medium text-sm">{tx.description}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            className={
                              tx.type === "income"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {tx.type === "income" ? "Pemasukan" : "Pengeluaran"}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-right font-semibold text-sm",
                            tx.type === "income" ? "text-primary" : "text-destructive"
                          )}
                        >
                          {tx.type === "income" ? "+" : "-"}
                          {formatCurrency(tx.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base md:text-lg">Manajemen Kegiatan</CardTitle>
                <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="islamic">
                      <Plus className="w-4 h-4 mr-1 md:mr-2" />
                      <span className="hidden sm:inline">Tambah Kegiatan</span>
                      <span className="sm:hidden">Tambah</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Kegiatan</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Judul Kegiatan</Label>
                        <Input 
                          placeholder="Kajian Subuh" 
                          value={eventTitle}
                          onChange={(e) => setEventTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Tipe Kegiatan</Label>
                        <Select value={eventType} onValueChange={setEventType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kajian">Kajian</SelectItem>
                            <SelectItem value="pengajian">Pengajian</SelectItem>
                            <SelectItem value="shalat">Shalat</SelectItem>
                            <SelectItem value="acara">Acara</SelectItem>
                            <SelectItem value="sosial">Sosial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Tanggal</Label>
                          <Input 
                            type="date" 
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Waktu</Label>
                          <Input 
                            type="time" 
                            value={eventTime}
                            onChange={(e) => setEventTime(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Deskripsi</Label>
                        <Input 
                          placeholder="Keterangan kegiatan" 
                          value={eventDescription}
                          onChange={(e) => setEventDescription(e.target.value)}
                        />
                      </div>
                      <Button variant="islamic" className="w-full" onClick={handleAddEvent}>
                        Simpan Kegiatan
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead className="hidden sm:table-cell">Tanggal</TableHead>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Tipe</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium text-sm">{event.title}</TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">{event.date}</TableCell>
                        <TableCell className="text-sm">{event.time}</TableCell>
                        <TableCell>
                          <Badge className="bg-primary/10 text-primary capitalize text-xs">
                            {event.type}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
