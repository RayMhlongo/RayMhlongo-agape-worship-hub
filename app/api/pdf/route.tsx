/* eslint-disable jsx-a11y/alt-text */
import { Document, Image, Page, StyleSheet, Text, View, renderToStream } from "@react-pdf/renderer";
import { NextRequest } from "next/server";
import { seedMembers, seedSchedules } from "@/data/seed";

export const dynamic = "force-static";

const styles = StyleSheet.create({
  page: {
    padding: 34,
    fontFamily: "Helvetica",
    backgroundColor: "#f8f7f3",
    color: "#111111"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#d8d4ca",
    paddingBottom: 18,
    marginBottom: 24
  },
  logo: {
    width: 58,
    height: 58,
    borderRadius: 29
  },
  eyebrow: {
    color: "#1478b8",
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 8
  },
  title: {
    fontSize: 34,
    fontWeight: 900
  },
  card: {
    borderWidth: 1,
    borderColor: "#ded9ce",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#ffffff"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  h2: {
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 8
  },
  meta: {
    fontSize: 10,
    color: "#6b6b6b",
    marginBottom: 10
  },
  pill: {
    fontSize: 9,
    padding: 6,
    backgroundColor: "#111111",
    color: "#f8f7f3",
    borderRadius: 999
  },
  text: {
    fontSize: 10,
    lineHeight: 1.5
  },
  footer: {
    position: "absolute",
    bottom: 22,
    left: 34,
    right: 34,
    textAlign: "center",
    fontSize: 9,
    color: "#8a857c"
  }
});

function RosterDocument({ orientation }: { orientation: "portrait" | "landscape" }) {
  return (
    <Document title="Agape Worship Hub Monthly Roster" author="Agape Worship Hub">
      <Page size="A4" orientation={orientation} style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Agape Worship Department</Text>
            <Text style={styles.title}>Monthly Roster</Text>
          </View>
          <Image src={`${process.cwd()}/public/agape-logo.jpeg`} style={styles.logo} />
        </View>
        {seedSchedules.map((schedule) => (
          <View key={schedule.id} style={styles.card}>
            <View style={styles.row}>
              <View>
                <Text style={styles.h2}>{schedule.title}</Text>
                <Text style={styles.meta}>{schedule.date} · {schedule.type} · Leader: {schedule.worshipLeader}</Text>
              </View>
              <Text style={styles.pill}>{schedule.status}</Text>
            </View>
            <Text style={styles.text}>
              {schedule.members
                .map((id) => seedMembers.find((member) => member.id === id))
                .filter(Boolean)
                .map((member) => `${member?.fullName} (${member?.instrument})`)
                .join("   |   ")}
            </Text>
            <Text style={styles.meta}>{schedule.notes}</Text>
          </View>
        ))}
        <Text style={styles.footer}>New Generation · Agape Worship Hub · Premium worship planning export</Text>
      </Page>
    </Document>
  );
}

export async function GET(request: NextRequest) {
  const orientation = request.nextUrl.searchParams.get("orientation") === "portrait" ? "portrait" : "landscape";
  const stream = await renderToStream(<RosterDocument orientation={orientation} />);
  return new Response(stream as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=agape-monthly-roster.pdf"
    }
  });
}
