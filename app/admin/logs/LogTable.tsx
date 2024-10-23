import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Log } from "@prisma/client";
import moment from "moment-jalaali";

interface Props {
  logs: Log[];
}

const LogTable = ({ logs }: Props) => {
  return (
    <Table>
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column.value}>{column.label}</TableColumn>
        ))}
      </TableHeader>

      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>{log.issuer}</TableCell>
            <TableCell>{log.assignedToSection}</TableCell>
            <TableCell>{log.message}</TableCell>
            <TableCell>{moment(log.createdAt).format("jYYYY/jM/jD")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LogTable;

const columns: { label: string; value: keyof Log }[] = [
  { label: "صادر کننده", value: "issuer" },
  { label: "مربوط به بخش", value: "assignedToSection" },
  { label: "پیام", value: "message" },
  { label: "تاریخ ایجاد", value: "createdAt" },
];
