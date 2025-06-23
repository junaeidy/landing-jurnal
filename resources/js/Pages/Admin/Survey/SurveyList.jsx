import React, { useEffect, useState, useCallback } from "react";
import {
    Input,
    Button,
    Chip,
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Tooltip,
    Spinner,
    Select,
    SelectItem,
} from "@heroui/react";
import { Link } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import ConfirmDialog from "@/Components/ConfirmDialog";
import { EditIcon, BarChartIcon, Trash2Icon, ClipboardIcon  } from "lucide-react";
import { PlusIcon } from "@/Components/Icons";

export default function SurveyList() {
    const [surveys, setSurveys] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchSurveys = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/admin/surveys");
            setSurveys(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSurveys();
    }, []);

    const getStatus = (survey) => {
        const now = new Date();
        const start = new Date(survey.start_at);
        const end = new Date(survey.end_at);
        if (now < start) return "Belum Dimulai";
        if (now > end) return "Selesai";
        return "Aktif";
    };

    const handleDelete = async () => {
        if (!selectedSurvey) return;
        try {
            await axios.delete(`/api/admin/surveys/${selectedSurvey.id}`);
            setSurveys((prev) =>
                prev.filter((s) => s.id !== selectedSurvey.id)
            );
            toast.success("Survey berhasil dihapus");
        } catch (err) {
            toast.error("Gagal menghapus survey");
        }
    };

    const filteredSurveys = surveys.filter((survey) => {
        const status = getStatus(survey).toLowerCase();
        return (
            survey.title.toLowerCase().includes(search.toLowerCase()) &&
            (statusFilter === "all" || status === statusFilter)
        );
    });

    const columns = [
        { name: "Judul", key: "title" },
        { name: "Periode", key: "periode" },
        { name: "Pertanyaan", key: "questions_count" },
        { name: "Status", key: "status" },
        { name: "Responden", key: "answers_count" },
        { name: "Aksi", key: "actions" },
    ];

    const renderCell = useCallback((survey, columnKey) => {
        switch (columnKey) {
            case "title":
                return <div className="text-sm font-semibold">{survey.title}</div>;
            case "periode":
                return `${survey.start_at?.slice(0, 10)} → ${survey.end_at?.slice(0, 10)}`;
            case "questions_count":
                return survey.questions_count ?? 0;
            case "answers_count":
                return survey.answers_count ?? 0;
            case "status":
                const status = getStatus(survey);
                const color =
                    status === "Aktif"
                        ? "success"
                        : status === "Selesai"
                        ? "danger"
                        : "warning";
                return (
                    <Chip color={color} size="sm" variant="flat">
                        {status}
                    </Chip>
                );
            case "actions":
    return (
        <div className="flex items-center gap-2">
            <Tooltip content="Edit Survey">
                <Link
                    href={`/admin/surveys/${survey.id}/edit`}
                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                >
                    <EditIcon size={18} />
                </Link>
            </Tooltip>

            <Tooltip content="Statistik">
                <Link
                    href={`/admin/surveys/${survey.id}/stats`}
                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                >
                    <BarChartIcon size={18} />
                </Link>
            </Tooltip>

            <Tooltip content="Salin Link Survey">
                <button
                    onClick={() => {
                        const url = `${window.location.origin}/survey/${survey.slug}`;
                        navigator.clipboard.writeText(url);
                        toast.success("Link disalin!");
                    }}
                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                >
                    <ClipboardIcon size={18} />
                </button>
            </Tooltip>

            <Tooltip color="danger" content="Hapus Survey">
                <button
                    onClick={() => {
                        setSelectedSurvey(survey);
                        setIsDialogOpen(true);
                    }}
                    className="text-lg text-danger cursor-pointer active:opacity-50"
                >
                    <Trash2Icon size={18} />
                </button>
            </Tooltip>
        </div>
    );
            default:
                return survey[columnKey];
        }
    }, []);

    return (
        <div className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <Input
                    isClearable
                    type="text"
                    placeholder="Cari survey..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/3"
                />

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Select
                        className="w-36"
                        aria-label="Filter Status"
                        selectedKeys={[statusFilter]}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <SelectItem key="all" value="all">
                            Semua Status
                        </SelectItem>
                        <SelectItem key="aktif" value="aktif">
                            Aktif
                        </SelectItem>
                        <SelectItem key="selesai" value="selesai">
                            Selesai
                        </SelectItem>
                        <SelectItem key="belum dimulai" value="belum dimulai">
                            Belum Dimulai
                        </SelectItem>
                    </Select>

                    <Button
                        color="primary"
                        as={Link}
                        href="/admin/surveys/create"
                        endContent={<PlusIcon />}
                    >
                        Tambah
                    </Button>
                </div>
            </div>

            <Table aria-label="Tabel Survey">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.key}
                            align={column.key === "actions" ? "center" : "start"}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>

                <TableBody
                    items={loading ? [] : filteredSurveys}
                    isLoading={loading}
                    loadingContent={<Spinner />}
                    emptyContent={!loading && "Tidak ada data survey."}
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => (
                                <TableCell>{renderCell(item, columnKey)}</TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <ConfirmDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleDelete}
                title="Konfirmasi Hapus Survey"
                message={`Apakah Anda yakin ingin menghapus survey "${selectedSurvey?.title}"?`}
            />
        </div>
    );
}
