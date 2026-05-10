import React, { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

// ============================================================================
// DESIGN TOKENS — Premium Private Banking Palette
// ============================================================================
const T = {
  // Backgrounds
  pageBg: "#f8f6f1", // ivory cream
  surface: "#ffffff", // white card
  surfaceWarm: "#faf6ec", // warm cream input/section bg
  surfaceCool: "#f4efe2", // slightly deeper cream
  navyBg: "#0a1f3d", // deep navy
  navyHover: "#142d52",
  // Accents
  gold: "#b8893a",
  goldLight: "#d4a857",
  goldSoft: "#e8c98a",
  goldOnNavy: "#d4a857",
  // Borders
  border: "#d9d1bf",
  borderSoft: "#e8dfc9",
  borderGold: "#b8893a",
  // Text
  navyText: "#0a1f3d",
  textPrimary: "#0a1f3d",
  textMuted: "#5a5447",
  textOnNavy: "#ffffff",
  textMutedOnNavy: "#c9c2b3",
  // Semantic
  success: "#047857",
  successBg: "#ecfdf5",
  successBorder: "#bbf7d0",
  danger: "#b91c1c",
  warning: "#b7791f",
  purple: "#6d28d9",
  purpleBg: "#f5f3ff",
  purpleBorder: "#ddd6fe",
  // Chart colors (kept distinct for category clarity)
  chartFixed: "#1d4ed8",
  chartExp: "#b8893a",
  chartHybrid: "#047857",
};

// ============================================================================
// REUSABLE STYLE OBJECTS
// ============================================================================
const S = {
  // Card
  card: {
    border: `1px solid ${T.border}`,
    background: T.surface,
    boxShadow: "0 1px 2px rgba(10,31,61,0.04)",
  },
  cardPad: {
    border: `1px solid ${T.border}`,
    background: T.surface,
    boxShadow: "0 1px 2px rgba(10,31,61,0.04)",
    padding: 24,
  },
  // Navy hero / page header
  pageHeader: {
    marginBottom: 32,
    borderBottom: `1px solid ${T.border}`,
    paddingBottom: 28,
  },
  goldRule: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  goldRuleLine: {
    height: 1,
    width: 40,
    background: T.gold,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.4em",
    color: T.gold,
    margin: 0,
  },
  h1: {
    marginTop: 14,
    fontSize: 44,
    fontWeight: 600,
    letterSpacing: "-0.04em",
    color: T.navyText,
    lineHeight: 1.1,
  },
  h2: {
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: "-0.02em",
    color: T.navyText,
    margin: 0,
  },
  h3: {
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: "-0.02em",
    color: T.navyText,
    margin: 0,
  },
  bodyMuted: {
    marginTop: 16,
    fontSize: 14.5,
    lineHeight: "26px",
    color: T.textMuted,
  },
  // Form
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: T.navyText,
    letterSpacing: "0.01em",
  },
  input: {
    marginTop: 8,
    width: "100%",
    border: `1px solid ${T.border}`,
    background: T.surfaceWarm,
    padding: "12px 16px",
    outline: "none",
    fontSize: 14,
    color: T.navyText,
    fontFamily: "inherit",
  },
  helper: {
    marginTop: 6,
    fontSize: 12,
    color: T.textMuted,
  },
  // Stat cards
  statNavy: {
    background: T.navyBg,
    padding: 20,
    color: "white",
    position: "relative",
    borderTop: `2px solid ${T.gold}`,
  },
  statCream: {
    border: `1px solid ${T.borderSoft}`,
    background: T.surfaceWarm,
    padding: 20,
  },
  statLabelNavy: {
    fontSize: 10.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.25em",
    color: T.goldOnNavy,
    margin: 0,
  },
  statLabelCream: {
    fontSize: 10.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.25em",
    color: T.gold,
    margin: 0,
  },
  statValue: {
    marginTop: 12,
    fontSize: 30,
    fontWeight: 600,
    letterSpacing: "-0.02em",
    margin: "12px 0 0",
  },
  // Closing point box
  closingBox: {
    marginTop: 20,
    background: T.navyBg,
    padding: 22,
    color: "white",
    borderTop: `2px solid ${T.gold}`,
  },
  // Buttons
  btnPrimary: {
    background: T.navyBg,
    color: T.goldOnNavy,
    padding: "12px 22px",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  // Tables
  tableWrap: {
    border: `1px solid ${T.border}`,
    background: T.surface,
    overflow: "hidden",
  },
  tableWrapScroll: {
    border: `1px solid ${T.border}`,
    background: T.surface,
    overflow: "auto",
    maxHeight: 360,
  },
  table: {
    width: "100%",
    textAlign: "left",
    fontSize: 13.5,
    borderCollapse: "collapse",
  },
  thead: {
    background: T.navyBg,
    color: T.goldOnNavy,
  },
  th: {
    padding: "14px 16px",
    fontWeight: 700,
    textTransform: "uppercase",
    fontSize: 11,
    letterSpacing: "0.15em",
    textAlign: "left",
  },
  td: {
    padding: "12px 16px",
    color: T.navyText,
    borderTop: `1px solid ${T.borderSoft}`,
  },
  // Section heading inside tools
  sectionHeading: {
    position: "relative",
    paddingBottom: 12,
    marginBottom: 18,
    borderBottom: `1px solid ${T.borderSoft}`,
  },
  sectionHeadingAccent: {
    position: "absolute",
    left: 0,
    bottom: -1,
    height: 2,
    width: 56,
    background: T.gold,
  },
};

// ============================================================================
// HELPERS
// ============================================================================
function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}
function moneyMYR(value) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

// Reusable components
function PageHero({ eyebrow, title, description }) {
  return (
    <div style={{ ...S.cardPad, marginBottom: 24 }}>
      <div style={S.goldRule}>
        <span style={S.goldRuleLine} />
        <p style={S.eyebrow}>{eyebrow}</p>
      </div>
      <h2 style={{ ...S.h1, fontSize: 32, marginTop: 12 }}>{title}</h2>
      {description && (
        <p style={{ ...S.bodyMuted, maxWidth: 720 }}>{description}</p>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={S.sectionHeading}>
      <h3 style={S.h3}>{children}</h3>
      <span style={S.sectionHeadingAccent} />
    </div>
  );
}

function NavyStat({ label, value, valueColor }) {
  return (
    <div style={S.statNavy}>
      <p style={S.statLabelNavy}>{label}</p>
      <p style={{ ...S.statValue, color: valueColor || "white" }}>{value}</p>
    </div>
  );
}

function CreamStat({ label, value, valueColor }) {
  return (
    <div style={S.statCream}>
      <p style={S.statLabelCream}>{label}</p>
      <p style={{ ...S.statValue, color: valueColor || T.navyText }}>{value}</p>
    </div>
  );
}

function ClosingPoint({ label, children }) {
  return (
    <div style={S.closingBox}>
      <p style={S.statLabelNavy}>{label}</p>
      <p
        style={{
          marginTop: 14,
          marginBottom: 0,
          fontSize: 16,
          lineHeight: "30px",
        }}
      >
        {children}
      </p>
    </div>
  );
}

// ============================================================================
// SECTIONS DATA
// ============================================================================
const sections = [
  {
    title: "Portfolio Management",
    description:
      "Tools to review client holdings and prepare allocation discussion.",
    tools: [
      {
        icon: "📊",
        name: "Client Portfolio Review",
        short: "Analyze and review client portfolios efficiently.",
        type: "portfolio",
        rateYear1: 0,
        rateYear2: 0,
        min: 0,
      },
      {
        icon: "💼",
        name: "Client Portfolio Allocation",
        short: "Manage and allocate assets across client portfolios.",
        type: "portfolio",
        rateYear1: 0,
        rateYear2: 0,
        min: 0,
      },
    ],
  },
  {
    title: "Financial Calculators",
    description:
      "Projection tools to show clients estimated investment outcomes.",
    tools: [
      {
        icon: "🏦",
        name: "Alphaline FPM Calculator",
        short:
          "Project Alphaline FPM returns using the 10% / 12% two-year cycle.",
        type: "fpm",
        rateYear1: 10,
        rateYear2: 12,
        min: 100000,
      },
      {
        icon: "💰",
        name: "Alphaline IGPM Calculator",
        short: "Hybrid fund: 6% fixed income + 10–20% capital growth.",
        type: "igpm",
        rateMin: 10,
        rateMax: 20,
        min: 10000,
      },
      {
        icon: "📈",
        name: "Exponential Growth Calculator",
        short: "Calculate exponential growth projections for investments.",
        type: "calculator",
        rateYear1: 12,
        rateYear2: 12,
        min: 10000,
      },
    ],
  },
  {
    title: "Offset Strategies",
    description:
      "Scenario tools to explain how investment returns may support cash-flow planning.",
    tools: [
      {
        icon: "🏠",
        name: "FPM Mortgage Offset Strategy",
        short:
          "Estimate how FPM returns may support or offset property loan repayments.",
        type: "calculator",
        rateYear1: 10,
        rateYear2: 12,
        min: 10000,
      },
      {
        icon: "🚗",
        name: "FPM Hire Purchase Offset Strategy",
        short:
          "Assess hire purchase options and how FPM dividends can offset repayments.",
        type: "calculator",
        rateYear1: 10,
        rateYear2: 12,
        min: 10000,
      },
    ],
  },
];

const allTools = sections.flatMap((s) => s.tools);

// ============================================================================
// SECTION CARD (Home dashboard tool tiles)
// ============================================================================
function SectionCard({ section, onOpen }) {
  return (
    <section
      style={{
        marginBottom: 32,
        border: `1px solid ${T.border}`,
        background: "white",
        boxShadow: "0 1px 2px rgba(10,31,61,0.04)",
      }}
    >
      <div
        style={{
          position: "relative",
          background: T.navyBg,
          padding: "20px 24px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: 4,
            background: T.gold,
          }}
        />
        <h2
          style={{
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "white",
            margin: 0,
          }}
        >
          {section.title}
        </h2>
        <p
          style={{
            marginTop: 4,
            marginBottom: 0,
            fontSize: 14,
            lineHeight: "24px",
            color: T.textMutedOnNavy,
          }}
        >
          {section.description}
        </p>
      </div>
      <div style={{ background: T.surfaceWarm, padding: 24 }}>
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {section.tools.map((tool) => (
            <button
              key={tool.name}
              onClick={() => onOpen(tool)}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                border: `1px solid ${T.border}`,
                background: "white",
                padding: 20,
                textAlign: "left",
                color: T.navyText,
                boxShadow: "0 1px 2px rgba(10,31,61,0.04)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = T.gold;
                e.currentTarget.style.boxShadow =
                  "0 10px 20px rgba(10,31,61,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.boxShadow =
                  "0 1px 2px rgba(10,31,61,0.04)";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: 3,
                  width: "100%",
                  background: `linear-gradient(to right, ${T.gold}, ${T.goldLight})`,
                }}
              />
              <div style={{ fontSize: 24 }}>{tool.icon}</div>
              <h3
                style={{
                  marginTop: 16,
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: T.navyText,
                }}
              >
                {tool.name}
              </h3>
              <p
                style={{
                  marginTop: 8,
                  minHeight: 44,
                  fontSize: 14,
                  lineHeight: "24px",
                  color: T.textMuted,
                }}
              >
                {tool.short}
              </p>
              <span
                style={{
                  marginTop: 20,
                  display: "inline-flex",
                  width: "fit-content",
                  alignItems: "center",
                  gap: 8,
                  background: T.navyBg,
                  padding: "10px 16px",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: T.goldOnNavy,
                }}
              >
                Open Tool <span>→</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TOOL: Alphaline FPM Calculator
// ============================================================================
function FPMCalculator() {
  const [initial, setInitial] = useState(100000);
  const [period, setPeriod] = useState(6);
  const [mode, setMode] = useState("compound");
  const [additional, setAdditional] = useState(0);
  const [additionalDuration, setAdditionalDuration] = useState(0);

  const fpm = useMemo(() => {
    let cumulative = 0;
    const rows = [];
    const lots = [{ amount: initial, startYear: 1 }];
    for (let year = 1; year <= period; year++) {
      if (additional > 0 && year >= 2 && year <= additionalDuration + 1) {
        lots.push({ amount: additional, startYear: year });
      }
      const capitalBase = lots.reduce((s, l) => s + l.amount, 0);
      let annualReturn = 0;
      const rateMap = {};
      lots.forEach((lot) => {
        const lotAge = year - lot.startYear + 1;
        const rate = lotAge % 2 === 1 ? 10 : 12;
        const lotReturn = lot.amount * (rate / 100);
        annualReturn += lotReturn;
        if (!rateMap[rate]) rateMap[rate] = 0;
        rateMap[rate] += lot.amount;
        if (mode === "compound") lot.amount += lotReturn;
      });
      const activeLots = Object.entries(rateMap).map(([r, a]) => ({
        rate: Number(r),
        amount: a,
      }));
      cumulative += annualReturn;
      const compoundedCapital = lots.reduce((s, l) => s + l.amount, 0);
      const yearEnd =
        mode === "compound" ? compoundedCapital : capitalBase + cumulative;
      rows.push({
        year,
        activeLots,
        capital: capitalBase,
        annualReturn,
        yearEnd,
        cumulative,
      });
    }
    const finalValue =
      rows.length > 0 ? rows[rows.length - 1].yearEnd : initial;
    return {
      finalValue,
      totalRoi: cumulative,
      averageAnnual: period > 0 ? cumulative / period : 0,
      rows,
    };
  }, [initial, period, mode, additional, additionalDuration]);

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHero
        eyebrow="BOA Alphaline Investment Limited"
        title="Alphaline FPM Calculator"
        description="Fixed Private Mandate projection based on a repeating two-year return cycle: Year 1 at 10%, Year 2 at 12%, then the cycle repeats."
      />

      <div
        style={{ display: "grid", gap: 24, gridTemplateColumns: "0.9fr 1.1fr" }}
      >
        <div style={S.cardPad}>
          <SectionTitle>Investment Parameters</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <label>
              <span style={S.label}>Initial Investment (USD)</span>
              <input
                value={initial}
                min="100000"
                step="1000"
                type="number"
                onChange={(e) => setInitial(Number(e.target.value))}
                style={S.input}
              />
            </label>
            <label>
              <span style={S.label}>Investment Period (Years)</span>
              <input
                value={period}
                min="1"
                max="20"
                type="number"
                onChange={(e) => setPeriod(Number(e.target.value))}
                style={S.input}
              />
            </label>
            <label>
              <span style={S.label}>Calculation Mode</span>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                style={S.input}
              >
                <option value="compound">Compounding Returns</option>
                <option value="payout">
                  Dividend Payout / Non-Compounding
                </option>
              </select>
            </label>
            <label>
              <span style={S.label}>
                Additional Annual Investment (Optional)
              </span>
              <input
                value={additional}
                min="0"
                step="1000"
                type="number"
                onChange={(e) => setAdditional(Number(e.target.value))}
                style={S.input}
              />
              <p style={S.helper}>Additional investment starts from Year 2.</p>
            </label>
            <label>
              <span style={S.label}>
                Additional Investment Duration (Years)
              </span>
              <input
                value={additionalDuration}
                min="0"
                max={Math.max(period - 1, 0)}
                type="number"
                onChange={(e) => setAdditionalDuration(Number(e.target.value))}
                style={S.input}
              />
              <p style={S.helper}>
                Example: 5 years means add new capital from Year 2 to Year 6.
              </p>
            </label>
          </div>
        </div>

        <div style={S.cardPad}>
          <SectionTitle>Investment Analysis Results</SectionTitle>
          <div
            style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}
          >
            <NavyStat label="Final Value" value={money(fpm.finalValue)} />
            <CreamStat label="Total ROI" value={money(fpm.totalRoi)} />
            <CreamStat
              label="Average Annual Return"
              value={money(fpm.averageAnnual)}
            />
            <CreamStat label="Return Cycle" value="10% / 12%" />
          </div>
          <ClosingPoint label="Client Speaking Point">
            Based on an initial investment of <strong>{money(initial)}</strong>,
            the projected final value after <strong>{period} years</strong> is{" "}
            <strong>{money(fpm.finalValue)}</strong>, with total projected ROI
            of <strong>{money(fpm.totalRoi)}</strong>.
          </ClosingPoint>
        </div>
      </div>

      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead style={S.thead}>
            <tr>
              <th style={S.th}>Year</th>
              <th style={S.th}>Rate Summary</th>
              <th style={S.th}>Capital Base</th>
              <th style={S.th}>Annual Return</th>
              <th style={S.th}>Year-End Value</th>
              <th style={S.th}>Cumulative ROI</th>
            </tr>
          </thead>
          <tbody>
            {fpm.rows.map((row) => (
              <tr key={row.year}>
                <td style={{ ...S.td, fontWeight: 700 }}>Year {row.year}</td>
                <td style={S.td}>
                  {row.activeLots.map((lot, i) => (
                    <span
                      key={i}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        marginRight: 8,
                        marginBottom: 4,
                        borderRadius: 999,
                        border: `1px solid ${T.border}`,
                        background: T.surfaceWarm,
                        padding: "4px 12px",
                        fontSize: 12,
                      }}
                    >
                      <span>{money(lot.amount)}</span>
                      <span style={{ fontWeight: 700, color: T.gold }}>
                        @ {lot.rate}%
                      </span>
                    </span>
                  ))}
                </td>
                <td style={S.td}>{money(row.capital)}</td>
                <td style={S.td}>{money(row.annualReturn)}</td>
                <td style={S.td}>{money(row.yearEnd)}</td>
                <td style={S.td}>{money(row.cumulative)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ============================================================================
// TOOL: Alphaline IGPM Calculator
// ============================================================================
function IGPMCalculator() {
  const [capital, setCapital] = useState(100000);
  const [cycles, setCycles] = useState(2);
  const [growthRate, setGrowthRate] = useState(15);

  const igpm = useMemo(() => {
    let balance = capital;
    let totalDividend = 0;
    let totalGrowth = 0;
    const rows = [];
    const rate = Number(growthRate) || 0;
    for (let cycle = 1; cycle <= cycles; cycle++) {
      const cycleStartCapital = balance;
      const fixedDividend = cycleStartCapital * 0.06;
      for (let cycleYear = 1; cycleYear <= 2; cycleYear++) {
        const year = (cycle - 1) * 2 + cycleYear;
        const startingCapital = balance;
        const growth = startingCapital * (rate / 100);
        const endingCapital = startingCapital + growth;
        totalDividend += fixedDividend;
        totalGrowth += growth;
        rows.push({
          year,
          cycle,
          startingCapital,
          fixedDividend,
          growth,
          endingCapital,
        });
        balance = endingCapital;
      }
    }
    return {
      finalCapital: balance,
      totalDividend,
      totalGrowth,
      totalGain: totalDividend + totalGrowth,
      rows,
    };
  }, [capital, cycles, growthRate]);

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHero
        eyebrow="BOA Alphaline Investment Limited"
        title="Alphaline IGPM Calculator"
        description="Income Growth Private Mandate projection: 1 cycle = 2 years. Fixed dividend is 6% p.a. based on each cycle's starting capital, while capital grows using the selected exponential return rate."
      />

      <div
        style={{ display: "grid", gap: 24, gridTemplateColumns: "0.9fr 1.1fr" }}
      >
        <div style={S.cardPad}>
          <SectionTitle>Investment Parameters</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <label>
              <span style={S.label}>Initial Investment (USD)</span>
              <input
                value={capital}
                min="100000"
                step="1000"
                type="number"
                onChange={(e) => setCapital(Number(e.target.value))}
                style={S.input}
              />
            </label>
            <label>
              <span style={S.label}>Number of 2-Year Cycles</span>
              <input
                value={cycles}
                min="1"
                max="10"
                type="number"
                onChange={(e) => setCycles(Number(e.target.value))}
                style={S.input}
              />
              <p style={S.helper}>Example: 3 cycles = 6 years.</p>
            </label>
            <label>
              <span style={S.label}>Expected Exponential Growth (%)</span>
              <input
                value={growthRate}
                min="10"
                max="20"
                step="0.5"
                type="number"
                onChange={(e) => setGrowthRate(Number(e.target.value))}
                style={S.input}
              />
              <p style={S.helper}>Product range: 10% - 20% on capital.</p>
            </label>
          </div>
        </div>

        <div style={S.cardPad}>
          <SectionTitle>Investment Analysis Results</SectionTitle>
          <div
            style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}
          >
            <NavyStat
              label="Final Capital Value"
              value={money(igpm.finalCapital)}
            />
            <CreamStat
              label="Total Fixed Dividend"
              value={money(igpm.totalDividend)}
              valueColor={T.success}
            />
            <CreamStat
              label="Total Capital Growth"
              value={money(igpm.totalGrowth)}
            />
            <CreamStat label="Total Gains" value={money(igpm.totalGain)} />
          </div>
          <ClosingPoint label="Client Speaking Point">
            With an investment of <strong>{money(capital)}</strong>, over{" "}
            <strong>
              {cycles} cycle{cycles > 1 ? "s" : ""}
            </strong>{" "}
            ({cycles * 2} years), projected capital value is{" "}
            <strong>{money(igpm.finalCapital)}</strong>, with total fixed
            dividend of <strong>{money(igpm.totalDividend)}</strong>.
          </ClosingPoint>
        </div>
      </div>

      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead style={S.thead}>
            <tr>
              <th style={S.th}>Year</th>
              <th style={S.th}>Cycle</th>
              <th style={S.th}>Capital Base</th>
              <th style={S.th}>Fixed 6% Dividend</th>
              <th style={S.th}>Growth on Capital</th>
              <th style={S.th}>Year-End Capital</th>
            </tr>
          </thead>
          <tbody>
            {igpm.rows.map((row) => (
              <tr key={row.year}>
                <td style={{ ...S.td, fontWeight: 700 }}>Year {row.year}</td>
                <td style={S.td}>Cycle {row.cycle}</td>
                <td style={S.td}>{money(row.startingCapital)}</td>
                <td style={{ ...S.td, color: T.success }}>
                  {money(row.fixedDividend)}
                </td>
                <td style={S.td}>{money(row.growth)}</td>
                <td style={S.td}>{money(row.endingCapital)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ============================================================================
// TOOL: Allocation Tool (Risk profile + sliders + fund inputs)
// ============================================================================
function AllocationTool() {
  const riskProfiles = {
    Conservative: {
      fixed: 80,
      exponential: 10,
      hybrid: 10,
      desc: "Prioritizes capital preservation with minimal growth exposure.",
    },
    "Mod. Conservative": {
      fixed: 65,
      exponential: 20,
      hybrid: 15,
      desc: "Focuses on stability while allowing moderate upside participation.",
    },
    Balanced: {
      fixed: 50,
      exponential: 35,
      hybrid: 15,
      desc: "Balances income stability with growth exposure.",
    },
    "Mod. Aggressive": {
      fixed: 30,
      exponential: 50,
      hybrid: 20,
      desc: "Emphasizes growth while keeping some defensive allocation.",
    },
    Aggressive: {
      fixed: 15,
      exponential: 70,
      hybrid: 15,
      desc: "Prioritizes higher growth potential with greater volatility tolerance.",
    },
  };

  const [total, setTotal] = useState(1000000);
  const [profile, setProfile] = useState("Balanced");
  const [alloc, setAlloc] = useState(riskProfiles.Balanced);
  const [fundInputs, setFundInputs] = useState({
    Fixed: [
      { name: "", value: 0 },
      { name: "", value: 0 },
      { name: "", value: 0 },
    ],
    Exponential: [
      { name: "", value: 0 },
      { name: "", value: 0 },
      { name: "", value: 0 },
    ],
    Hybrid: [
      { name: "", value: 0 },
      { name: "", value: 0 },
      { name: "", value: 0 },
    ],
  });
  const [fundInputMode, setFundInputMode] = useState({
    Fixed: "percentage",
    Exponential: "percentage",
    Hybrid: "percentage",
  });

  function applyProfile(name) {
    setProfile(name);
    if (riskProfiles[name]) setAlloc(riskProfiles[name]);
  }
  function updateAlloc(key, value) {
    const v = Math.max(0, Math.min(100, Number(value) || 0));
    const otherKeys = ["fixed", "exponential", "hybrid"].filter(
      (k) => k !== key
    );
    const remaining = 100 - v;
    const currentOtherTotal = otherKeys.reduce((s, k) => s + alloc[k], 0) || 1;
    const next = { ...alloc, [key]: v };
    otherKeys.forEach((k) => {
      next[k] = Math.round((alloc[k] / currentOtherTotal) * remaining);
    });
    const diff = 100 - (next.fixed + next.exponential + next.hybrid);
    next[otherKeys[0]] += diff;
    setAlloc(next);
    setProfile("Custom");
  }
  function categoryKey(c) {
    return c === "Fixed"
      ? "fixed"
      : c === "Exponential"
      ? "exponential"
      : "hybrid";
  }
  function categoryAmount(k) {
    return total * (alloc[k] / 100);
  }
  function updateFund(category, index, field, value) {
    const next = { ...fundInputs };
    next[category] = [...next[category]];
    next[category][index] = {
      ...next[category][index],
      [field]: field === "value" ? Math.max(0, Number(value) || 0) : value,
    };
    setFundInputs(next);
  }
  function switchFundMode(category, newMode) {
    const currentMode = fundInputMode[category];
    if (currentMode === newMode) return;
    const key = categoryKey(category);
    const targetCapital = categoryAmount(key);
    const convertedItems = fundInputs[category].map((item) => {
      const currentValue = Number(item.value || 0);
      const convertedValue =
        currentMode === "percentage" && newMode === "amount"
          ? targetCapital * (currentValue / 100)
          : targetCapital > 0
          ? (currentValue / targetCapital) * 100
          : 0;
      return { ...item, value: Number(convertedValue.toFixed(2)) };
    });
    setFundInputs({ ...fundInputs, [category]: convertedItems });
    setFundInputMode({ ...fundInputMode, [category]: newMode });
  }

  const allocationData = [
    {
      name: "Fixed Returns",
      key: "fixed",
      value: alloc.fixed,
      color: T.chartFixed,
    },
    {
      name: "Exponential Returns",
      key: "exponential",
      value: alloc.exponential,
      color: T.chartExp,
    },
    {
      name: "Hybrid Returns",
      key: "hybrid",
      value: alloc.hybrid,
      color: T.chartHybrid,
    },
  ];

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div
        style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr 1fr" }}
      >
        <div style={S.cardPad}>
          <p style={S.statLabelCream}>Total Investment Amount</p>
          <input
            value={total}
            type="number"
            onChange={(e) => setTotal(Number(e.target.value))}
            style={{ ...S.input, marginTop: 12, fontSize: 26, fontWeight: 600 }}
          />
        </div>
        <div style={S.cardPad}>
          <p style={S.statLabelCream}>Allocation Status</p>
          <p style={S.statValue}>100%</p>
          <p style={{ ...S.helper, marginTop: 8 }}>
            Capital fully allocated across portfolios.
          </p>
        </div>
        <div style={S.cardPad}>
          <p style={S.statLabelCream}>Selected Profile</p>
          <p style={{ ...S.statValue, color: T.navyText }}>{profile}</p>
          <p style={{ ...S.helper, marginTop: 8 }}>
            Portfolio direction based on risk preference.
          </p>
        </div>
      </div>

      <div style={S.cardPad}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h2 style={S.h2}>Risk Profile Allocation</h2>
              <p style={{ ...S.helper, marginTop: 6 }}>
                Select a profile or adjust allocation manually. Total allocation
                is locked to 100%.
              </p>
            </div>
            <select
              value={profile}
              onChange={(e) => applyProfile(e.target.value)}
              style={{ ...S.input, marginTop: 0, width: "auto" }}
            >
              {Object.keys(riskProfiles).map((name) => (
                <option key={name}>{name}</option>
              ))}
              <option>Custom</option>
            </select>
          </div>
        </div>

        <div
          style={{
            marginTop: 24,
            display: "grid",
            gap: 24,
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          <div style={{ position: "relative", height: 288 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={allocationData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={90}
                  outerRadius={125}
                  paddingAngle={2}
                >
                  {allocationData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <p style={{ fontSize: 12, color: T.textMuted, margin: 0 }}>
                Total
              </p>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: T.navyText,
                  margin: 0,
                }}
              >
                100%
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {allocationData.map((item) => (
              <div key={item.key}>
                <div
                  style={{
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 14,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        height: 12,
                        width: 12,
                        borderRadius: 999,
                        background: item.color,
                      }}
                    />
                    <span style={{ fontWeight: 700 }}>{item.name}</span>
                  </div>
                  <span style={{ fontWeight: 700 }}>
                    {item.value}% · {money(categoryAmount(item.key))}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={item.value}
                  onChange={(e) => updateAlloc(item.key, e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            ))}
            <div
              style={{
                border: `1px solid ${T.borderSoft}`,
                background: T.surfaceWarm,
                padding: 16,
                fontSize: 14,
                lineHeight: "24px",
                color: T.textMuted,
              }}
            >
              <strong style={{ color: T.navyText }}>{profile} Strategy:</strong>{" "}
              {riskProfiles[profile]?.desc ||
                "Custom allocation tailored to client preference."}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr 1fr" }}
      >
        {allocationData.map((item) => (
          <div key={item.key} style={S.cardPad}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p style={{ fontWeight: 700, color: item.color, margin: 0 }}>
                {item.name}
              </p>
              <p style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
                {item.value}%
              </p>
            </div>
            <p
              style={{
                marginTop: 12,
                fontSize: 26,
                fontWeight: 600,
                color: T.navyText,
              }}
            >
              {money(categoryAmount(item.key))}
            </p>
            <p style={S.helper}>Target allocation amount</p>
          </div>
        ))}
      </div>

      <div style={S.cardPad}>
        <SectionTitle>Fund Details Input</SectionTitle>
        <p style={S.helper}>
          Key in product names by percentage or dollar amount to match the
          desired capital allocation.
        </p>
        <div
          style={{
            marginTop: 20,
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {["Fixed", "Exponential", "Hybrid"].map((category) => {
            const key = categoryKey(category);
            const color =
              key === "fixed"
                ? T.chartFixed
                : key === "exponential"
                ? T.chartExp
                : T.chartHybrid;
            const items = fundInputs[category];
            const mode = fundInputMode[category];
            const targetCapital = categoryAmount(key);
            const usedAmount =
              mode === "percentage"
                ? items.reduce(
                    (s, i) => s + targetCapital * (Number(i.value || 0) / 100),
                    0
                  )
                : items.reduce((s, i) => s + Number(i.value || 0), 0);
            const used =
              targetCapital > 0 ? (usedAmount / targetCapital) * 100 : 0;
            const remaining = Math.max(100 - used, 0);
            const remainingAmount = Math.max(targetCapital - usedAmount, 0);
            return (
              <div
                key={category}
                style={{
                  border: `1px solid ${T.borderSoft}`,
                  background: T.surfaceWarm,
                  padding: 16,
                }}
              >
                <h3 style={{ fontWeight: 700, color, margin: 0 }}>
                  {category} Returns Funds
                </h3>
                <p style={{ marginTop: 8, fontSize: 12, color: T.textMuted }}>
                  Target Capital: {money(targetCapital)}
                </p>
                <div
                  style={{
                    marginTop: 12,
                    display: "inline-flex",
                    border: `1px solid ${T.border}`,
                    background: "white",
                    fontSize: 12,
                  }}
                >
                  <button
                    onClick={() => switchFundMode(category, "percentage")}
                    style={{
                      padding: "8px 12px",
                      fontWeight: 700,
                      background:
                        mode === "percentage" ? T.navyBg : "transparent",
                      color: mode === "percentage" ? T.goldOnNavy : T.textMuted,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Percentage
                  </button>
                  <button
                    onClick={() => switchFundMode(category, "amount")}
                    style={{
                      padding: "8px 12px",
                      fontWeight: 700,
                      background: mode === "amount" ? T.navyBg : "transparent",
                      color: mode === "amount" ? T.goldOnNavy : T.textMuted,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Dollar Amount
                  </button>
                </div>
                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 110px",
                        gap: 8,
                      }}
                    >
                      <input
                        value={item.name}
                        onChange={(e) =>
                          updateFund(category, index, "name", e.target.value)
                        }
                        placeholder="Fund Name"
                        style={{
                          ...S.input,
                          marginTop: 0,
                          padding: "8px 12px",
                          fontSize: 13,
                        }}
                      />
                      <div style={{ position: "relative" }}>
                        <input
                          value={item.value}
                          onChange={(e) =>
                            updateFund(category, index, "value", e.target.value)
                          }
                          type="number"
                          min="0"
                          max={mode === "percentage" ? 100 : undefined}
                          style={{
                            ...S.input,
                            marginTop: 0,
                            padding: "8px 24px 8px 12px",
                            fontSize: 13,
                          }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            right: 10,
                            top: 8,
                            fontSize: 12,
                            color: T.textMuted,
                          }}
                        >
                          {mode === "percentage" ? "%" : "$"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 16,
                    border: `1px solid ${T.borderSoft}`,
                    background: "white",
                    padding: 12,
                    fontSize: 13,
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Allocated</span>
                    <strong>{used.toFixed(1)}%</strong>
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Allocated Capital</span>
                    <strong>{money(usedAmount)}</strong>
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Remaining</span>
                    <strong
                      style={{ color: remaining === 0 ? T.success : T.warning }}
                    >
                      {remaining.toFixed(1)}%
                    </strong>
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Unallocated Capital</span>
                    <strong>{money(remainingAmount)}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TOOL: Exponential Growth Calculator
// ============================================================================
function ExponentialCalculator() {
  const [initial, setInitial] = useState(10000);
  const [rate, setRate] = useState(12);
  const [reinvest, setReinvest] = useState(50);
  const [years, setYears] = useState(10);

  const data = useMemo(() => {
    let balance = initial;
    let totalWithdrawn = 0;
    const rows = [];
    for (let year = 1; year <= years; year++) {
      const start = balance;
      const returns = start * (rate / 100);
      const reinvestAmt = returns * (reinvest / 100);
      const withdrawAmt = returns - reinvestAmt;
      balance = start + reinvestAmt;
      totalWithdrawn += withdrawAmt;
      rows.push({
        year,
        start,
        returns,
        withdrawAmt,
        reinvestAmt,
        end: balance,
      });
    }
    return { finalBalance: balance, totalWithdrawn, rows };
  }, [initial, rate, reinvest, years]);

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHero
        eyebrow="Projection Tool"
        title="Exponential Growth Calculator"
        description="Visualize how annual returns are split between cash withdrawal and reinvestment for long-term capital growth."
      />

      <div style={S.cardPad}>
        <SectionTitle>Investment Parameters</SectionTitle>
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          <label>
            <span style={S.label}>Investment Amount</span>
            <input
              value={initial}
              min="0"
              step="1000"
              type="number"
              onChange={(e) => setInitial(Number(e.target.value))}
              style={S.input}
            />
          </label>
          <label>
            <span style={S.label}>Expected Annual Return (%)</span>
            <input
              value={rate}
              min="0"
              step="0.5"
              type="number"
              onChange={(e) => setRate(Number(e.target.value))}
              style={S.input}
            />
          </label>
          <label>
            <span style={S.label}>Reinvest Percentage (%)</span>
            <input
              value={reinvest}
              min="0"
              max="100"
              step="1"
              type="number"
              onChange={(e) =>
                setReinvest(Math.max(0, Math.min(100, Number(e.target.value))))
              }
              style={S.input}
            />
          </label>
        </div>

        <div style={{ marginTop: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={S.label}>Years to Display</span>
            <span style={{ ...S.label, color: T.gold }}>{years} years</span>
          </div>
          <input
            value={years}
            min="1"
            max="30"
            type="range"
            onChange={(e) => setYears(Number(e.target.value))}
            style={{ marginTop: 12, width: "100%" }}
          />
          <div
            style={{
              marginTop: 4,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: T.textMuted,
            }}
          >
            <span>1</span>
            <span>30</span>
          </div>
        </div>
      </div>

      <div
        style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr 1fr" }}
      >
        <CreamStat label="Total Investment" value={money(initial)} />
        <CreamStat
          label="Total Withdrawn"
          value={money(data.totalWithdrawn)}
          valueColor={T.success}
        />
        <NavyStat label="Final Balance" value={money(data.finalBalance)} />
      </div>

      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead style={S.thead}>
            <tr>
              <th style={S.th}>Year</th>
              <th style={S.th}>Starting Balance</th>
              <th style={S.th}>Returns Earned</th>
              <th style={S.th}>Amount Withdrawn</th>
              <th style={S.th}>Amount Reinvested</th>
              <th style={S.th}>Ending Balance</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.year}>
                <td style={{ ...S.td, fontWeight: 700 }}>Year {r.year}</td>
                <td style={S.td}>{money(r.start)}</td>
                <td style={{ ...S.td, color: T.success }}>
                  {money(r.returns)}
                </td>
                <td style={{ ...S.td, color: T.danger }}>
                  {money(r.withdrawAmt)}
                </td>
                <td style={{ ...S.td, color: T.purple }}>
                  {money(r.reinvestAmt)}
                </td>
                <td style={{ ...S.td, fontWeight: 700 }}>{money(r.end)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ============================================================================
// TOOL: FPM Mortgage Offset
// ============================================================================
function FPMMortgageOffset() {
  const [loanBalanceMYR, setLoanBalanceMYR] = useState("");
  const [fpmInvestmentUSD, setFpmInvestmentUSD] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [loanInterest, setLoanInterest] = useState("");
  const [loanTerm, setLoanTerm] = useState("");

  const result = useMemo(() => {
    const loan = Number(loanBalanceMYR) || 0;
    const usd = Number(fpmInvestmentUSD) || 0;
    const fx = Number(exchangeRate) || 0;
    const annualRate = Number(loanInterest) || 0;
    const years = Number(loanTerm) || 0;
    const months = years * 12;
    const monthlyRate = annualRate / 100 / 12;
    const monthlyPayment =
      months > 0
        ? monthlyRate > 0
          ? (loan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
          : loan / months
        : 0;
    const annualPayment = monthlyPayment * 12;
    const fpmCapitalMYR = usd * fx;
    const fpmDividendMYR = (year) => usd * (year % 2 === 1 ? 0.1 : 0.12) * fx;

    const regularRows = [];
    let regularBalance = loan;
    let regularInterest = 0;
    for (let year = 1; year <= years; year++) {
      let interestPaid = 0,
        principalPaid = 0;
      const startBalance = regularBalance;
      for (let m = 1; m <= 12 && regularBalance > 0; m++) {
        const interest = regularBalance * monthlyRate;
        const principal = Math.min(
          Math.max(monthlyPayment - interest, 0),
          regularBalance
        );
        interestPaid += interest;
        principalPaid += principal;
        regularBalance -= principal;
      }
      regularInterest += interestPaid;
      regularRows.push({
        year,
        startBalance,
        interestPaid,
        principalPaid,
        endBalance: Math.max(regularBalance, 0),
      });
    }

    const earlyRows = [];
    let earlyBalance = loan;
    let earlyInterest = 0;
    let earlyPayoffYear = years;
    for (let year = 1; year <= years; year++) {
      let interestPaid = 0,
        principalPaid = 0;
      const dividendMYR = fpmDividendMYR(year);
      const startBalance = earlyBalance;
      for (let m = 1; m <= 12 && earlyBalance > 0; m++) {
        const interest = earlyBalance * monthlyRate;
        const principal = Math.min(
          Math.max(monthlyPayment - interest, 0),
          earlyBalance
        );
        interestPaid += interest;
        principalPaid += principal;
        earlyBalance -= principal;
      }
      const canSettleBefore = earlyBalance > 0 && earlyBalance <= fpmCapitalMYR;
      if (earlyBalance > 0) {
        const extra = Math.min(dividendMYR, earlyBalance);
        principalPaid += extra;
        earlyBalance -= extra;
      }
      const canSettleAfter = earlyBalance >= 0 && earlyBalance <= fpmCapitalMYR;
      earlyInterest += interestPaid;
      earlyRows.push({
        year,
        startBalance,
        interestPaid,
        principalPaid,
        dividendMYR,
        endBalance: Math.max(earlyBalance, 0),
        canSettleWithFpmCapital: canSettleBefore || canSettleAfter,
      });
      if (earlyBalance <= 0) {
        earlyPayoffYear = year;
        break;
      }
    }

    const offsetRows = regularRows.map((row) => {
      const dividendMYR = fpmDividendMYR(row.year);
      const clientPayment = Math.max(annualPayment - dividendMYR, 0);
      return {
        ...row,
        dividendMYR,
        clientPayment,
        canSettleWithFpmCapital:
          row.endBalance > 0 && row.endBalance <= fpmCapitalMYR,
      };
    });

    const totalFpmDividends = offsetRows.reduce((s, r) => s + r.dividendMYR, 0);
    const offsetTotalClientPayment = offsetRows.reduce(
      (s, r) => s + r.clientPayment,
      0
    );
    const regularTotalCost = loan + regularInterest;
    const earlyTotalCost = loan + earlyInterest;
    const yearsSaved = Math.max(years - earlyPayoffYear, 0);
    const interestSaved = Math.max(regularInterest - earlyInterest, 0);
    const paymentSavings = Math.max(totalFpmDividends, 0);
    const avgAnnualFpmDividend = years > 0 ? totalFpmDividends / years : 0;
    const coverage =
      annualPayment > 0 ? (avgAnnualFpmDividend / annualPayment) * 100 : 0;
    const bestStrategy =
      yearsSaved > 0
        ? "Early Payoff"
        : coverage > 50
        ? "Payment Offset"
        : "Partial Offset";
    const recommendation =
      bestStrategy === "Early Payoff"
        ? `Use FPM dividends to accelerate mortgage repayment. This may shorten the loan by ${yearsSaved} years and reduce total interest by ${moneyMYR(
            interestSaved
          )}.`
        : bestStrategy === "Payment Offset"
        ? `Use FPM dividends to reduce annual out-of-pocket mortgage payments by up to ${moneyMYR(
            avgAnnualFpmDividend
          )}.`
        : "Use FPM dividends as partial mortgage support while keeping the original loan structure.";
    const settlementRows = earlyRows.filter((r) => r.canSettleWithFpmCapital);
    const firstSettlementYear =
      settlementRows.length > 0 ? settlementRows[0].year : null;

    return {
      loan,
      usd,
      fx,
      fpmCapitalMYR,
      years,
      monthlyPayment,
      annualPayment,
      regularInterest,
      regularTotalCost,
      earlyInterest,
      earlyTotalCost,
      earlyPayoffYear,
      yearsSaved,
      interestSaved,
      regularRows,
      earlyRows,
      offsetRows,
      totalFpmDividends,
      offsetTotalClientPayment,
      firstSettlementYear,
      paymentSavings,
      bestStrategy,
      recommendation,
    };
  }, [loanBalanceMYR, fpmInvestmentUSD, exchangeRate, loanInterest, loanTerm]);

  const hasInputs =
    result.loan > 0 && result.usd > 0 && result.fx > 0 && result.years > 0;

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHero
        eyebrow="Offset Strategy"
        title="FPM Mortgage Offset Strategy"
        description="Compare a regular mortgage against two FPM strategies: early payoff using FPM dividends, or payment offset to reduce out-of-pocket cashflow."
      />

      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "0.85fr 1.15fr",
        }}
      >
        <div style={S.cardPad}>
          <SectionTitle>Mortgage & FPM Inputs</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              placeholder="Current Loan Balance (MYR)"
              value={loanBalanceMYR}
              onChange={(e) => setLoanBalanceMYR(e.target.value)}
              style={{ ...S.input, marginTop: 0 }}
            />
            <input
              placeholder="FPM Investment Amount (USD)"
              value={fpmInvestmentUSD}
              onChange={(e) => setFpmInvestmentUSD(e.target.value)}
              style={{ ...S.input, marginTop: 0 }}
            />
            <input
              placeholder="USD to MYR Exchange Rate, e.g. 4.7000"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              style={{ ...S.input, marginTop: 0 }}
            />
            <input
              placeholder="Loan Interest Rate (%)"
              value={loanInterest}
              onChange={(e) => setLoanInterest(e.target.value)}
              style={{ ...S.input, marginTop: 0 }}
            />
            <input
              placeholder="Loan Term (Years)"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              style={{ ...S.input, marginTop: 0 }}
            />
          </div>
        </div>

        <div style={S.cardPad}>
          <SectionTitle>Strategy Summary</SectionTitle>
          <div
            style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}
          >
            <NavyStat
              label="Monthly Loan Payment"
              value={moneyMYR(result.monthlyPayment)}
            />
            <CreamStat
              label="Annual Loan Payment"
              value={moneyMYR(result.annualPayment)}
            />
            <CreamStat
              label="Total Interest"
              value={moneyMYR(result.regularInterest)}
            />
            <div
              style={{
                ...S.statCream,
                background: T.successBg,
                border: `1px solid ${T.successBorder}`,
              }}
            >
              <p style={{ ...S.statLabelCream, color: T.success }}>
                FPM Early Payoff Saving
              </p>
              <p style={{ ...S.statValue, color: T.success }}>
                {result.yearsSaved} yrs + {moneyMYR(result.interestSaved)}
              </p>
            </div>
          </div>
          <ClosingPoint label="Recommended Strategy">
            <strong
              style={{
                color: T.goldLight,
                fontSize: 20,
                display: "block",
                marginBottom: 8,
              }}
            >
              {result.bestStrategy}
            </strong>
            {result.recommendation}
          </ClosingPoint>
        </div>
      </div>

      {hasInputs && (
        <>
          {/* Regular Loan */}
          <div style={S.cardPad}>
            <div
              style={{
                marginBottom: 20,
                padding: 20,
                border: `1px solid ${T.borderSoft}`,
                background: "white",
              }}
            >
              <h3 style={{ fontWeight: 700, color: T.danger, margin: 0 }}>
                🏢 Regular Loan
              </h3>
              <ul
                style={{
                  marginTop: 14,
                  marginBottom: 0,
                  paddingLeft: 18,
                  fontSize: 14,
                  color: T.textPrimary,
                  lineHeight: "26px",
                }}
              >
                <li>
                  Monthly: <strong>{moneyMYR(result.monthlyPayment)}</strong>
                </li>
                <li>
                  Total Interest:{" "}
                  <strong>{moneyMYR(result.regularInterest)}</strong>
                </li>
                <li>
                  Duration: <strong>{result.years} years</strong>
                </li>
                <li>
                  Total Cost:{" "}
                  <strong>{moneyMYR(result.regularTotalCost)}</strong>
                </li>
              </ul>
            </div>
            <SectionTitle>Regular Loan Schedule</SectionTitle>
            <div style={S.tableWrapScroll}>
              <table style={S.table}>
                <thead style={{ ...S.thead, position: "sticky", top: 0 }}>
                  <tr>
                    <th style={S.th}>Year</th>
                    <th style={S.th}>Start Balance</th>
                    <th style={S.th}>Interest Paid</th>
                    <th style={S.th}>Principal Paid</th>
                    <th style={S.th}>End Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.regularRows.map((row) => (
                    <tr key={row.year}>
                      <td style={S.td}>Year {row.year}</td>
                      <td style={S.td}>{moneyMYR(row.startBalance)}</td>
                      <td style={S.td}>{moneyMYR(row.interestPaid)}</td>
                      <td style={S.td}>{moneyMYR(row.principalPaid)}</td>
                      <td style={S.td}>{moneyMYR(row.endBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FPM Early Payoff */}
          <div style={S.cardPad}>
            <div
              style={{
                marginBottom: 20,
                padding: 20,
                border: `1px solid ${T.successBorder}`,
                background: T.successBg,
              }}
            >
              <h3 style={{ fontWeight: 700, color: T.success, margin: 0 }}>
                💎 FPM Early Payoff
              </h3>
              <ul
                style={{
                  marginTop: 14,
                  marginBottom: 0,
                  paddingLeft: 18,
                  fontSize: 14,
                  color: "#064e3b",
                  lineHeight: "26px",
                }}
              >
                <li>
                  Monthly: <strong>{moneyMYR(result.monthlyPayment)}</strong>
                </li>
                <li>
                  Total Interest:{" "}
                  <strong>{moneyMYR(result.earlyInterest)}</strong>
                </li>
                <li>
                  Duration: <strong>{result.earlyPayoffYear} years</strong>
                </li>
                <li>
                  Save:{" "}
                  <strong>
                    {result.yearsSaved} yrs + {moneyMYR(result.interestSaved)}
                  </strong>
                </li>
              </ul>
            </div>
            <SectionTitle>
              With FPM Dividends — Early Payoff Schedule
            </SectionTitle>
            <div style={S.tableWrapScroll}>
              <table style={S.table}>
                <thead style={{ ...S.thead, position: "sticky", top: 0 }}>
                  <tr>
                    <th style={S.th}>Year</th>
                    <th style={S.th}>Start Balance</th>
                    <th style={S.th}>Interest Paid</th>
                    <th style={S.th}>Principal Paid</th>
                    <th style={S.th}>FPM Dividend</th>
                    <th style={S.th}>End Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.earlyRows.map((row) => (
                    <tr
                      key={row.year}
                      style={
                        row.canSettleWithFpmCapital
                          ? { background: "#fff7ed" }
                          : {}
                      }
                    >
                      <td style={S.td}>
                        {row.canSettleWithFpmCapital ? "🏆 " : ""}Year{" "}
                        {row.year}
                      </td>
                      <td style={S.td}>{moneyMYR(row.startBalance)}</td>
                      <td style={S.td}>{moneyMYR(row.interestPaid)}</td>
                      <td style={S.td}>{moneyMYR(row.principalPaid)}</td>
                      <td style={{ ...S.td, color: T.success }}>
                        {moneyMYR(row.dividendMYR)}
                      </td>
                      <td style={S.td}>{moneyMYR(row.endBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Offset */}
          <div style={S.cardPad}>
            <div
              style={{
                marginBottom: 20,
                padding: 20,
                border: `1px solid ${T.purpleBorder}`,
                background: T.purpleBg,
              }}
            >
              <h3 style={{ fontWeight: 700, color: T.purple, margin: 0 }}>
                🎯 Payment Offset
              </h3>
              <ul
                style={{
                  marginTop: 14,
                  marginBottom: 0,
                  paddingLeft: 18,
                  fontSize: 14,
                  color: T.textPrimary,
                  lineHeight: "26px",
                }}
              >
                <li>
                  Duration: <strong>{result.years} years</strong>
                </li>
                <li>
                  FPM Dividends Used:{" "}
                  <strong>{moneyMYR(result.totalFpmDividends)}</strong>
                </li>
                <li>
                  Your Total Out-of-Pocket:{" "}
                  <strong>{moneyMYR(result.offsetTotalClientPayment)}</strong>
                </li>
                <li>
                  Annual Payment Before Offset:{" "}
                  <strong>{moneyMYR(result.annualPayment)}</strong>
                </li>
              </ul>
            </div>
            <SectionTitle>FPM Cashflow Relief Strategy</SectionTitle>
            <p style={S.helper}>
              Same loan duration, but FPM dividends reduce the client's actual
              out-of-pocket payment each year.
            </p>
            <div style={{ ...S.tableWrapScroll, marginTop: 12 }}>
              <table style={S.table}>
                <thead style={{ ...S.thead, position: "sticky", top: 0 }}>
                  <tr>
                    <th style={S.th}>Year</th>
                    <th style={S.th}>Required Payment</th>
                    <th style={S.th}>FPM Dividend</th>
                    <th style={S.th}>Client Payment</th>
                    <th style={S.th}>End Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.offsetRows.map((row) => (
                    <tr
                      key={row.year}
                      style={
                        row.canSettleWithFpmCapital
                          ? { background: "#fff7ed" }
                          : {}
                      }
                    >
                      <td style={S.td}>
                        {row.canSettleWithFpmCapital ? "🏆 " : ""}Year{" "}
                        {row.year}
                      </td>
                      <td style={S.td}>{moneyMYR(result.annualPayment)}</td>
                      <td style={{ ...S.td, color: T.purple }}>
                        {moneyMYR(row.dividendMYR)}
                      </td>
                      <td style={{ ...S.td, color: T.success }}>
                        {moneyMYR(row.clientPayment)}
                      </td>
                      <td style={S.td}>{moneyMYR(row.endBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategy Intelligence */}
          <div
            style={{
              ...S.cardPad,
              border: `1px solid ${T.gold}`,
              background: "#fff7db",
            }}
          >
            <SectionTitle>🎯 Strategy Intelligence</SectionTitle>
            <div
              style={{
                display: "grid",
                gap: 16,
                gridTemplateColumns: "1fr 1fr 1fr",
              }}
            >
              <CreamStat label="Best Use Case" value={result.bestStrategy} />
              <CreamStat
                label="Interest Saved"
                value={moneyMYR(result.interestSaved)}
                valueColor={T.success}
              />
              <CreamStat
                label="Cashflow Relief"
                value={moneyMYR(result.paymentSavings)}
                valueColor={T.purple}
              />
            </div>
            <ClosingPoint label="Advisor Closing Line">
              Instead of viewing your mortgage and investment separately, this
              strategy uses FPM dividends as a cashflow tool: either shorten
              your debt timeline or reduce your annual payment burden.
            </ClosingPoint>
          </div>

          {/* Early Settlement */}
          <div
            style={{
              ...S.cardPad,
              border: `1px solid #f59e0b`,
              background: "#fff7ed",
            }}
          >
            <SectionTitle>🏆 Early Settlement Option</SectionTitle>
            <p
              style={{
                marginTop: 0,
                fontSize: 14,
                lineHeight: "24px",
                color: "#7c2d12",
              }}
            >
              Highlighted rows (🏆) show years where the client can withdraw FPM
              capital ({moneyMYR(result.fpmCapitalMYR)}) to completely pay off
              the remaining loan balance for immediate debt freedom.
            </p>
            <div
              style={{
                marginTop: 16,
                border: `1px solid #fed7aa`,
                background: "white",
                padding: 16,
              }}
            >
              {result.firstSettlementYear ? (
                <p
                  style={{
                    margin: 0,
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#c2410c",
                  }}
                >
                  Earliest settlement opportunity: Year{" "}
                  {result.firstSettlementYear}
                </p>
              ) : (
                <p style={{ margin: 0, fontSize: 14, color: T.textMuted }}>
                  No early settlement year found within the selected loan term.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

// ============================================================================
// TOOL: FPM Hire Purchase Offset
// ============================================================================
function FPMHirePurchaseOffset() {
  const [loanBalanceMYR, setLoanBalanceMYR] = useState("");
  const [fpmInvestmentUSD, setFpmInvestmentUSD] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [flatRate, setFlatRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState(null); // null defaults to last year

  const hp = useMemo(() => {
    const loan = Number(loanBalanceMYR) || 0;
    const usd = Number(fpmInvestmentUSD) || 0;
    const fx = Number(exchangeRate) || 0;
    const rate = Number(flatRate) || 0;
    const years = Number(loanTerm) || 0;
    const annualPrincipal = years > 0 ? loan / years : 0;
    const annualInterest = loan * (rate / 100);
    const annualPayment = annualPrincipal + annualInterest;
    const monthlyPayment = annualPayment / 12;
    const totalInterest = annualInterest * years;
    const fpmCapitalMYR = usd * fx;
    const dividendMYR = (year) => usd * (year % 2 === 1 ? 0.1 : 0.12) * fx;
    const regularRows = [];
    let balance = loan;
    for (let year = 1; year <= years; year++) {
      const startBalance = balance;
      const principalPaid = Math.min(annualPrincipal, balance);
      balance = Math.max(balance - principalPaid, 0);
      regularRows.push({
        year,
        startBalance,
        interestPaid: annualInterest,
        principalPaid,
        endBalance: balance,
      });
    }
    const coverageRows = regularRows.map((row) => {
      const divMYR = dividendMYR(row.year);
      return {
        ...row,
        dividendMYR: divMYR,
        clientPayment: Math.max(annualPayment - divMYR, 0),
        canSettleWithFpmCapital:
          row.endBalance > 0 && row.endBalance <= fpmCapitalMYR,
      };
    });
    const totalFpmDividends = coverageRows.reduce(
      (s, r) => s + r.dividendMYR,
      0
    );

    // ====== CASH vs FPM STRATEGY COMPARISON ======
    // Malaysian car depreciation curve (% drop from previous year)
    const depreciationSchedule = [
      0.25, 0.15, 0.1, 0.1, 0.1, 0.08, 0.08, 0.08, 0.08,
    ];
    const getDepreciationRate = (year) =>
      depreciationSchedule[year - 1] !== undefined
        ? depreciationSchedule[year - 1]
        : 0.08;

    const comparisonRows = [];
    let carValue = loan; // car price = HP loan balance (full financed)
    let cumulativeDividends = 0;
    let cumulativeInstallments = 0;

    for (let year = 1; year <= years; year++) {
      const depRate = getDepreciationRate(year);
      const startCarValue = carValue;
      carValue = startCarValue * (1 - depRate);
      const dividendThisYear = usd * (year % 2 === 1 ? 0.1 : 0.12) * fx;
      const installmentThisYear = annualPayment;
      cumulativeDividends += dividendThisYear;
      cumulativeInstallments += installmentThisYear;

      // NET POSITION across dividends vs installments (carry-forward across years)
      // Positive = surplus (dividends > installments cumulatively)
      // Negative = deficit (you paid out of pocket cumulatively)
      const netDividendVsInstallment =
        cumulativeDividends - cumulativeInstallments;

      // ===== CASH PATH =====
      // Cash buyer spent the full car price upfront, has only depreciated car
      const cashMoneyOut = loan;
      const cashAssets = carValue;
      const cashNetPosition = cashAssets - cashMoneyOut; // negative = wealth lost

      // ===== FPM PATH =====
      // Money out (real cash that left the client's pocket):
      //   - FPM investment (Day 1)
      //   - PLUS deficit if installments > dividends (only when net is negative)
      //   - MINUS surplus if dividends > installments (only when net is positive — extra cash gained!)
      // Cleaner: client's true cash position = -(FPM invested) + netDividendVsInstallment
      //   netDividendVsInstallment is + if surplus, - if deficit
      const fpmMoneyOut =
        fpmCapitalMYR + Math.max(-netDividendVsInstallment, 0); // only count out-of-pocket as money out
      const fpmSurplusInHand = Math.max(netDividendVsInstallment, 0); // any extra dividend money sitting with client
      const fpmAssets = carValue + fpmCapitalMYR + fpmSurplusInHand;
      const fpmNetPosition = fpmAssets - fpmMoneyOut; // can be positive (gained) or negative (lost)

      // Advantage of FPM strategy vs cash
      const advantage = fpmNetPosition - cashNetPosition;

      comparisonRows.push({
        year,
        depRate,
        carValue,
        // year-level
        dividendThisYear,
        installmentThisYear,
        // cumulative
        cumulativeDividends,
        cumulativeInstallments,
        netDividendVsInstallment,
        // cash path
        cashMoneyOut,
        cashAssets,
        cashNetPosition,
        // fpm path
        fpmMoneyOut,
        fpmSurplusInHand,
        fpmAssets,
        fpmNetPosition,
        // advantage
        advantage,
      });
    }

    return {
      loan,
      usd,
      fx,
      years,
      monthlyPayment,
      annualPayment,
      totalInterest,
      regularRows,
      coverageRows,
      totalFpmDividends,
      fpmCapitalMYR,
      comparisonRows,
    };
  }, [loanBalanceMYR, fpmInvestmentUSD, exchangeRate, flatRate, loanTerm]);

  const hasInputs = hp.loan > 0 && hp.usd > 0 && hp.fx > 0 && hp.years > 0;

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHero
        eyebrow="Offset Strategy"
        title="FPM Hire Purchase Offset Strategy"
        description="Use FPM dividends to support hire purchase repayments and reduce yearly cashflow pressure."
      />

      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "0.85fr 1.15fr",
        }}
      >
        <div style={S.cardPad}>
          <SectionTitle>Hire Purchase Inputs</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              placeholder="Current HP Loan Balance (MYR)"
              value={loanBalanceMYR}
              onChange={(e) => setLoanBalanceMYR(e.target.value)}
              style={{ ...S.input, marginTop: 0 }}
            />
            <input
              placeholder="FPM Investment Amount (USD)"
              value={fpmInvestmentUSD}
              onChange={(e) => setFpmInvestmentUSD(e.target.value)}
              style={{ ...S.input, marginTop: 0 }}
            />
            <input
              placeholder="USD to MYR Exchange Rate"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              style={{ ...S.input, marginTop: 0 }}
            />
            <input
              placeholder="Hire Purchase Flat Rate (%)"
              value={flatRate}
              onChange={(e) => setFlatRate(e.target.value)}
              style={{ ...S.input, marginTop: 0 }}
            />
            <input
              placeholder="Loan Term (Years)"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              style={{ ...S.input, marginTop: 0 }}
            />
          </div>
        </div>

        <div style={S.cardPad}>
          <SectionTitle>Strategy Summary</SectionTitle>
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "1fr 1fr 1fr",
            }}
          >
            <NavyStat
              label="Monthly HP Payment"
              value={moneyMYR(hp.monthlyPayment)}
            />
            <CreamStat
              label="Total Flat Interest"
              value={moneyMYR(hp.totalInterest)}
            />
            <div
              style={{
                ...S.statCream,
                background: T.purpleBg,
                border: `1px solid ${T.purpleBorder}`,
              }}
            >
              <p style={{ ...S.statLabelCream, color: T.purple }}>
                Total FPM Dividends
              </p>
              <p style={{ ...S.statValue, color: T.purple }}>
                {moneyMYR(hp.totalFpmDividends)}
              </p>
            </div>
          </div>
          <ClosingPoint label="Client Speaking Point">
            Your <strong>{money(hp.usd)}</strong> FPM investment can be
            positioned as a cashflow relief tool to help cover part of your
            monthly car commitment.
          </ClosingPoint>
        </div>
      </div>

      {hasInputs && (
        <>
          <div
            style={{ display: "grid", gap: 24, gridTemplateColumns: "1fr 1fr" }}
          >
            <div
              style={{
                padding: 20,
                border: `1px solid ${T.borderSoft}`,
                background: "white",
              }}
            >
              <h3 style={{ fontWeight: 700, color: T.danger, margin: 0 }}>
                🚗 Regular Hire Purchase
              </h3>
              <ul
                style={{
                  marginTop: 14,
                  marginBottom: 0,
                  paddingLeft: 18,
                  fontSize: 14,
                  lineHeight: "26px",
                }}
              >
                <li>
                  Monthly: <strong>{moneyMYR(hp.monthlyPayment)}</strong>
                </li>
                <li>
                  Total Interest: <strong>{moneyMYR(hp.totalInterest)}</strong>
                </li>
                <li>
                  Duration: <strong>{hp.years} years</strong>
                </li>
                <li>
                  Total Cost:{" "}
                  <strong>{moneyMYR(hp.loan + hp.totalInterest)}</strong>
                </li>
              </ul>
            </div>
            <div
              style={{
                padding: 20,
                border: `1px solid ${T.purpleBorder}`,
                background: T.purpleBg,
              }}
            >
              <h3 style={{ fontWeight: 700, color: T.purple, margin: 0 }}>
                💳 FPM Cashflow Relief
              </h3>
              <ul
                style={{
                  marginTop: 14,
                  marginBottom: 0,
                  paddingLeft: 18,
                  fontSize: 14,
                  lineHeight: "26px",
                }}
              >
                <li>Fixed monthly payment remains</li>
                <li>FPM pays portions automatically</li>
                <li>
                  Duration: <strong>{hp.years} years</strong>
                </li>
                <li>Your reduced payments vary yearly</li>
              </ul>
            </div>
          </div>

          <div style={S.cardPad}>
            <SectionTitle>
              🚗 Regular Hire Purchase (Flat Rate System)
            </SectionTitle>
            <p style={S.helper}>
              Flat-rate interest is calculated on the full loan amount across
              the full term.
            </p>
            <div style={{ ...S.tableWrapScroll, marginTop: 12 }}>
              <table style={S.table}>
                <thead style={{ ...S.thead, position: "sticky", top: 0 }}>
                  <tr>
                    <th style={S.th}>Year</th>
                    <th style={S.th}>Start Balance</th>
                    <th style={S.th}>Interest Paid</th>
                    <th style={S.th}>Principal Paid</th>
                    <th style={S.th}>End Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {hp.regularRows.map((row) => (
                    <tr key={row.year}>
                      <td style={S.td}>Year {row.year}</td>
                      <td style={S.td}>{moneyMYR(row.startBalance)}</td>
                      <td style={S.td}>{moneyMYR(row.interestPaid)}</td>
                      <td style={S.td}>{moneyMYR(row.principalPaid)}</td>
                      <td style={S.td}>{moneyMYR(row.endBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div
            style={{
              ...S.cardPad,
              background: T.purpleBg,
              border: `1px solid ${T.purpleBorder}`,
            }}
          >
            <SectionTitle>💳 FPM Cashflow Relief Strategy</SectionTitle>
            <p style={{ ...S.helper, color: "#5b21b6" }}>
              Use FPM dividends to cover your payments while the loan schedule
              remains unchanged.
            </p>
            <div
              style={{
                ...S.tableWrapScroll,
                marginTop: 12,
                background: "white",
              }}
            >
              <table style={S.table}>
                <thead style={{ ...S.thead, position: "sticky", top: 0 }}>
                  <tr>
                    <th style={S.th}>Year</th>
                    <th style={S.th}>Required Payment</th>
                    <th style={S.th}>FPM Dividend</th>
                    <th style={S.th}>Your Payment</th>
                    <th style={S.th}>End Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {hp.coverageRows.map((row) => (
                    <tr
                      key={row.year}
                      style={
                        row.canSettleWithFpmCapital
                          ? { background: "#fff7ed" }
                          : {}
                      }
                    >
                      <td style={S.td}>
                        {row.canSettleWithFpmCapital ? "🏆 " : ""}Year{" "}
                        {row.year}
                      </td>
                      <td style={S.td}>{moneyMYR(hp.annualPayment)}</td>
                      <td style={{ ...S.td, color: T.purple }}>
                        {moneyMYR(row.dividendMYR)}
                      </td>
                      <td style={{ ...S.td, color: T.success }}>
                        {moneyMYR(row.clientPayment)}
                      </td>
                      <td style={S.td}>{moneyMYR(row.endBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ============================================================ */}
          {/* CASH PURCHASE vs FPM STRATEGY COMPARISON                     */}
          {/* ============================================================ */}
          <div
            style={{
              ...S.cardPad,
              background: "#fffaf0",
              border: `1px solid ${T.gold}`,
            }}
          >
            <div style={S.goldRule}>
              <span style={S.goldRuleLine} />
              <p style={S.eyebrow}>The Wealth Preservation Pitch</p>
            </div>
            <h2 style={{ ...S.h2, marginTop: 14, fontSize: 26 }}>
              🚗 vs 💎 &nbsp; Cash Purchase vs FPM Strategy
            </h2>
            <p style={{ ...S.bodyMuted, maxWidth: 720, marginTop: 12 }}>
              The car depreciates the same way regardless of how it's paid for.
              The difference is whether the client's wealth disappears with the
              car — or stays intact in their FPM portfolio.
            </p>

            {/* ====== TIMELINE SLIDER ====== */}
            {(() => {
              const activeYear =
                selectedYear === null || selectedYear > hp.years
                  ? hp.years
                  : Math.max(selectedYear, 1);
              const row =
                hp.comparisonRows.find((r) => r.year === activeYear) ||
                hp.comparisonRows[hp.comparisonRows.length - 1];
              if (!row) return null;
              const carValueLost = hp.loan - row.carValue;
              const carValueLostPct =
                hp.loan > 0 ? (carValueLost / hp.loan) * 100 : 0;
              const fpmIsAhead = row.fpmNetPosition >= 0;
              const cashIsAhead = row.cashNetPosition >= 0;

              return (
                <>
                  <div
                    style={{
                      marginTop: 24,
                      padding: 20,
                      background: T.surfaceWarm,
                      border: `1px solid ${T.borderSoft}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 12,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.25em",
                          color: T.gold,
                          margin: 0,
                        }}
                      >
                        📅 Timeline Scrubber
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 14,
                          fontWeight: 700,
                          color: T.navyText,
                        }}
                      >
                        Viewing:{" "}
                        <span style={{ color: T.gold, fontSize: 18 }}>
                          Year {activeYear}
                        </span>{" "}
                        of {hp.years}
                      </p>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max={hp.years}
                      value={activeYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      style={{ width: "100%" }}
                    />
                    <div
                      style={{
                        marginTop: 4,
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 11,
                        color: T.textMuted,
                      }}
                    >
                      <span>Year 1</span>
                      <span>Year {hp.years}</span>
                    </div>
                  </div>

                  {/* HERO CARDS — driven by activeYear */}
                  <div
                    style={{
                      marginTop: 20,
                      display: "grid",
                      gap: 16,
                      gridTemplateColumns: "1fr 1fr",
                    }}
                  >
                    {/* ============= OPTION A: PAY CASH ============= */}
                    <div
                      style={{
                        position: "relative",
                        padding: 24,
                        border: `1px solid ${T.danger}`,
                        background: "#fef2f2",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          height: 3,
                          width: "100%",
                          background: T.danger,
                        }}
                      />
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.25em",
                          color: T.danger,
                          margin: 0,
                        }}
                      >
                        Option A · Pay Cash
                      </p>
                      <h3 style={{ ...S.h3, marginTop: 12, fontSize: 20 }}>
                        Buy the Car Outright
                      </h3>

                      <div
                        style={{
                          marginTop: 18,
                          paddingTop: 14,
                          borderTop: `1px solid #fecaca`,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.18em",
                            color: T.danger,
                            margin: 0,
                            marginBottom: 8,
                          }}
                        >
                          Money Out
                        </p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 10,
                          }}
                        >
                          <span style={{ fontSize: 13, color: T.textMuted }}>
                            Cash Spent (Day 1)
                          </span>
                          <strong style={{ color: T.navyText }}>
                            {moneyMYR(hp.loan)}
                          </strong>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 10,
                          }}
                        >
                          <span style={{ fontSize: 13, color: T.textMuted }}>
                            HP Installments
                          </span>
                          <strong style={{ color: "#9ca3af" }}>—</strong>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 10,
                            paddingTop: 8,
                            borderTop: `1px dashed #fecaca`,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: T.navyText,
                            }}
                          >
                            Total Money Out
                          </span>
                          <strong style={{ color: T.danger, fontSize: 15 }}>
                            {moneyMYR(row.cashMoneyOut)}
                          </strong>
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: 16,
                          paddingTop: 14,
                          borderTop: `1px solid #fecaca`,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.18em",
                            color: T.success,
                            margin: 0,
                            marginBottom: 8,
                          }}
                        >
                          What You Have
                        </p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 10,
                          }}
                        >
                          <span style={{ fontSize: 13, color: T.textMuted }}>
                            Car at Year {activeYear}
                          </span>
                          <strong style={{ color: T.navyText }}>
                            {moneyMYR(row.carValue)}
                          </strong>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 10,
                          }}
                        >
                          <span style={{ fontSize: 13, color: T.textMuted }}>
                            FPM Capital
                          </span>
                          <strong style={{ color: "#9ca3af" }}>—</strong>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 10,
                            paddingTop: 8,
                            borderTop: `1px dashed #fecaca`,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: T.navyText,
                            }}
                          >
                            Total Assets
                          </span>
                          <strong style={{ color: T.navyText, fontSize: 15 }}>
                            {moneyMYR(row.cashAssets)}
                          </strong>
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: 18,
                          padding: 18,
                          background: T.danger,
                          color: "white",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.2em",
                            color: "#fecaca",
                            margin: 0,
                          }}
                        >
                          Net Position at Year {activeYear}
                        </p>
                        <p
                          style={{
                            marginTop: 10,
                            marginBottom: 0,
                            fontSize: 32,
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {moneyMYR(row.cashAssets)}
                        </p>
                        <p
                          style={{
                            marginTop: 8,
                            marginBottom: 0,
                            fontSize: 12,
                            color: "#fecaca",
                          }}
                        >
                          Just the depreciated car ·{" "}
                          {carValueLostPct.toFixed(1)}% lost to depreciation
                        </p>
                      </div>
                    </div>

                    {/* ============= OPTION B: FPM STRATEGY ============= */}
                    <div
                      style={{
                        position: "relative",
                        padding: 24,
                        border: `2px solid ${T.gold}`,
                        background: "#fffbeb",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          height: 3,
                          width: "100%",
                          background: `linear-gradient(to right, ${T.gold}, ${T.goldLight})`,
                        }}
                      />
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.25em",
                          color: T.gold,
                          margin: 0,
                        }}
                      >
                        Option B · FPM Strategy ✨
                      </p>
                      <h3 style={{ ...S.h3, marginTop: 12, fontSize: 20 }}>
                        Invest, Loan the Car
                      </h3>

                      <div
                        style={{
                          marginTop: 18,
                          paddingTop: 14,
                          borderTop: `1px solid #fde68a`,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.18em",
                            color: T.danger,
                            margin: 0,
                            marginBottom: 8,
                          }}
                        >
                          Money Out
                        </p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 10,
                          }}
                        >
                          <span style={{ fontSize: 13, color: T.textMuted }}>
                            Invested in FPM (Day 1)
                          </span>
                          <strong style={{ color: T.navyText }}>
                            {moneyMYR(hp.fpmCapitalMYR)}
                          </strong>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 6,
                          }}
                        >
                          <span style={{ fontSize: 13, color: T.textMuted }}>
                            HP Installments (to Yr {activeYear})
                          </span>
                          <strong style={{ color: T.navyText }}>
                            {moneyMYR(row.cumulativeInstallments)}
                          </strong>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 6,
                          }}
                        >
                          <span style={{ fontSize: 13, color: T.textMuted }}>
                            FPM Dividends Earned
                          </span>
                          <strong style={{ color: T.success }}>
                            + {moneyMYR(row.cumulativeDividends)}
                          </strong>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 10,
                            paddingTop: 8,
                            borderTop: `1px dashed #fde68a`,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: T.navyText,
                            }}
                          >
                            After FPM Dividends
                          </span>
                          <strong
                            style={{
                              color:
                                row.netDividendVsInstallment >= 0
                                  ? T.success
                                  : T.danger,
                              fontSize: 15,
                            }}
                          >
                            {row.netDividendVsInstallment >= 0 ? "+ " : "− "}
                            {moneyMYR(Math.abs(row.netDividendVsInstallment))}
                          </strong>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 11,
                            color: T.textMuted,
                            fontStyle: "italic",
                          }}
                        >
                          {row.netDividendVsInstallment >= 0
                            ? "Dividends covered all installments — surplus carries forward"
                            : "Out-of-pocket needed to top up; surpluses in later years can offset"}
                        </p>
                      </div>

                      <div
                        style={{
                          marginTop: 16,
                          paddingTop: 14,
                          borderTop: `1px solid #fde68a`,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.18em",
                            color: T.success,
                            margin: 0,
                            marginBottom: 8,
                          }}
                        >
                          What You Have
                        </p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 10,
                          }}
                        >
                          <span style={{ fontSize: 13, color: T.textMuted }}>
                            Car at Year {activeYear}
                          </span>
                          <strong style={{ color: T.navyText }}>
                            {moneyMYR(row.carValue)}
                          </strong>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 10,
                          }}
                        >
                          <span style={{ fontSize: 13, color: T.textMuted }}>
                            FPM Capital (Intact ✓)
                          </span>
                          <strong style={{ color: T.success }}>
                            {moneyMYR(hp.fpmCapitalMYR)}
                          </strong>
                        </div>
                        {row.fpmSurplusInHand > 0 && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 10,
                            }}
                          >
                            <span style={{ fontSize: 13, color: T.textMuted }}>
                              Dividend Surplus in Hand
                            </span>
                            <strong style={{ color: T.success }}>
                              {moneyMYR(row.fpmSurplusInHand)}
                            </strong>
                          </div>
                        )}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 10,
                            paddingTop: 8,
                            borderTop: `1px dashed #fde68a`,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: T.navyText,
                            }}
                          >
                            Total Assets
                          </span>
                          <strong style={{ color: T.navyText, fontSize: 15 }}>
                            {moneyMYR(row.fpmAssets)}
                          </strong>
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: 18,
                          padding: 18,
                          background: T.navyBg,
                          color: "white",
                          borderTop: `2px solid ${T.gold}`,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.2em",
                            color: T.goldOnNavy,
                            margin: 0,
                          }}
                        >
                          Net Position at Year {activeYear}
                        </p>
                        <p
                          style={{
                            marginTop: 10,
                            marginBottom: 0,
                            fontSize: 32,
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            color: T.goldLight,
                          }}
                        >
                          {moneyMYR(row.fpmAssets)}
                        </p>
                        <p
                          style={{
                            marginTop: 8,
                            marginBottom: 0,
                            fontSize: 12,
                            color: T.goldOnNavy,
                          }}
                        >
                          Car {moneyMYR(row.carValue)} + FPM Capital{" "}
                          {moneyMYR(hp.fpmCapitalMYR)}
                          {row.netDividendVsInstallment > 0 && (
                            <>
                              {" "}
                              + Surplus {moneyMYR(row.netDividendVsInstallment)}
                            </>
                          )}
                          {row.netDividendVsInstallment < 0 && (
                            <>
                              {" "}
                              − Shortfall{" "}
                              {moneyMYR(Math.abs(row.netDividendVsInstallment))}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* THE ADVANTAGE BANNER — pure Total Assets difference */}
                  <div
                    style={{
                      marginTop: 20,
                      padding: 26,
                      background: T.navyBg,
                      color: "white",
                      borderTop: `3px solid ${T.gold}`,
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.3em",
                        color: T.goldOnNavy,
                        margin: 0,
                      }}
                    >
                      FPM Strategy Advantage at Year {activeYear}
                    </p>
                    <p
                      style={{
                        marginTop: 12,
                        marginBottom: 0,
                        fontSize: 44,
                        fontWeight: 600,
                        letterSpacing: "-0.03em",
                        color: T.goldLight,
                      }}
                    >
                      + {moneyMYR(row.fpmAssets - row.cashAssets)}
                    </p>
                    <p
                      style={{
                        marginTop: 10,
                        marginBottom: 0,
                        fontSize: 14,
                        color: T.textMutedOnNavy,
                      }}
                    >
                      Cash holds{" "}
                      <strong style={{ color: "white" }}>
                        {moneyMYR(row.cashAssets)}
                      </strong>{" "}
                      &nbsp;·&nbsp; FPM holds{" "}
                      <strong style={{ color: T.goldLight }}>
                        {moneyMYR(row.fpmAssets)}
                      </strong>
                    </p>
                  </div>
                </>
              );
            })()}

            {/* YEAR BY YEAR TRACKER */}
            <div style={{ marginTop: 24 }}>
              <SectionTitle>Year-by-Year Wealth Tracker</SectionTitle>
              <p style={S.helper}>
                Net Position = Total Assets the client physically holds at that
                year. Cash path: just the depreciated car. FPM path: car +
                capital + dividend surplus (or − shortfall).
              </p>
              <div
                style={{
                  ...S.tableWrapScroll,
                  background: "white",
                  marginTop: 12,
                }}
              >
                <table style={S.table}>
                  <thead style={{ ...S.thead, position: "sticky", top: 0 }}>
                    <tr>
                      <th style={S.th}>Year</th>
                      <th style={S.th}>Depreciation</th>
                      <th style={S.th}>Cash Net Position</th>
                      <th style={S.th}>FPM Advantage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hp.comparisonRows.map((row) => {
                      const activeYear =
                        selectedYear === null || selectedYear > hp.years
                          ? hp.years
                          : Math.max(selectedYear, 1);
                      const isActive = row.year === activeYear;
                      const advantage = row.fpmAssets - row.cashAssets;
                      return (
                        <tr
                          key={row.year}
                          style={
                            isActive
                              ? {
                                  background: "#fffbeb",
                                  borderLeft: `3px solid ${T.gold}`,
                                }
                              : {}
                          }
                        >
                          <td style={{ ...S.td, fontWeight: 700 }}>
                            {isActive ? "👉 " : ""}Year {row.year}
                          </td>
                          <td style={{ ...S.td, color: T.danger }}>
                            −{(row.depRate * 100).toFixed(0)}%
                          </td>
                          <td style={{ ...S.td, color: T.danger }}>
                            {moneyMYR(row.cashAssets)}
                          </td>
                          <td
                            style={{ ...S.td, color: T.gold, fontWeight: 700 }}
                          >
                            + {moneyMYR(advantage)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* THE CLOSING PITCH */}
            {(() => {
              const final = hp.comparisonRows[hp.comparisonRows.length - 1];
              if (!final) return null;
              const finalAdvantage = final.fpmAssets - final.cashAssets;
              return (
                <ClosingPoint label="Advisor Closing Line">
                  After <strong>{hp.years} years</strong>, the cash buyer's{" "}
                  <strong>{moneyMYR(hp.loan)}</strong> turned into a depreciated
                  car worth just <strong>{moneyMYR(final.carValue)}</strong> —
                  that's all they hold. The FPM client paid{" "}
                  <strong>{moneyMYR(final.cumulativeInstallments)}</strong> in
                  installments, but earned{" "}
                  <strong>{moneyMYR(final.cumulativeDividends)}</strong> in
                  dividends (
                  {final.netDividendVsInstallment >= 0 ? (
                    <>
                      a{" "}
                      <strong>
                        {moneyMYR(final.netDividendVsInstallment)} surplus
                      </strong>
                    </>
                  ) : (
                    <>
                      a{" "}
                      <strong>
                        {moneyMYR(Math.abs(final.netDividendVsInstallment))}{" "}
                        shortfall
                      </strong>
                    </>
                  )}
                  ), and still holds the same car <em>plus</em> their original{" "}
                  <strong>{moneyMYR(hp.fpmCapitalMYR)}</strong> FPM capital
                  intact. Final position: Cash holds{" "}
                  <strong>{moneyMYR(final.cashAssets)}</strong> · FPM holds{" "}
                  <strong style={{ color: T.goldLight, fontSize: 18 }}>
                    {moneyMYR(final.fpmAssets)}
                  </strong>
                  . The FPM strategy leaves the client{" "}
                  <strong style={{ color: T.goldLight, fontSize: 18 }}>
                    + {moneyMYR(finalAdvantage)}
                  </strong>{" "}
                  wealthier.
                </ClosingPoint>
              );
            })()}
          </div>
        </>
      )}
    </section>
  );
}

// ============================================================================
// TOOL: Generic projection (used for tools without dedicated pages — fallback)
// ============================================================================
function GenericProjection({ selected }) {
  const [capital, setCapital] = useState(100000);
  const [years, setYears] = useState(5);
  const [payoutMode, setPayoutMode] = useState("cash");

  const result = useMemo(() => {
    let balance = capital;
    let totalDividend = 0;
    const rows = [];
    for (let year = 1; year <= years; year++) {
      const rate = year % 2 === 1 ? selected.rateYear1 : selected.rateYear2;
      const dividend = balance * (rate / 100);
      totalDividend += dividend;
      const ending = payoutMode === "reinvest" ? balance + dividend : balance;
      rows.push({ year, rate, start: balance, dividend, ending });
      balance = ending;
    }
    return {
      totalDividend,
      totalValue: balance,
      averageAnnual: years > 0 ? totalDividend / years : 0,
      rows,
    };
  }, [capital, years, selected, payoutMode]);

  return (
    <section style={S.cardPad}>
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}
      >
        <label>
          <span style={S.label}>Investment Amount</span>
          <input
            value={capital}
            min={selected.min}
            step="1000"
            type="number"
            onChange={(e) => setCapital(Number(e.target.value))}
            style={S.input}
          />
        </label>
        <label>
          <span style={S.label}>Years</span>
          <input
            value={years}
            min="1"
            max="10"
            type="number"
            onChange={(e) => setYears(Number(e.target.value))}
            style={S.input}
          />
        </label>
        <label>
          <span style={S.label}>Dividend Mode</span>
          <select
            value={payoutMode}
            onChange={(e) => setPayoutMode(e.target.value)}
            style={S.input}
          >
            <option value="cash">Cash payout</option>
            <option value="reinvest">Reinvest / compound</option>
          </select>
        </label>
      </div>

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gap: 16,
          gridTemplateColumns: "1fr 1fr 1fr",
        }}
      >
        <NavyStat label="Projected Value" value={money(result.totalValue)} />
        <CreamStat
          label="Projected Dividend"
          value={money(result.totalDividend)}
        />
        <CreamStat
          label="Average Per Year"
          value={money(result.averageAnnual)}
        />
      </div>

      <ClosingPoint label="Client Speaking Point">
        With an investment of <strong>{money(capital)}</strong>, the projected
        total value after{" "}
        <strong>
          {years} year{years > 1 ? "s" : ""}
        </strong>{" "}
        is <strong>{money(result.totalValue)}</strong>.
      </ClosingPoint>

      <div style={{ ...S.tableWrap, marginTop: 24 }}>
        <table style={S.table}>
          <thead style={S.thead}>
            <tr>
              <th style={S.th}>Year</th>
              <th style={S.th}>Rate</th>
              <th style={S.th}>Starting Capital</th>
              <th style={S.th}>Projected Return</th>
              <th style={S.th}>Ending Value</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row) => (
              <tr key={row.year}>
                <td style={S.td}>Year {row.year}</td>
                <td style={S.td}>{row.rate}%</td>
                <td style={S.td}>{money(row.start)}</td>
                <td style={S.td}>{money(row.dividend)}</td>
                <td style={S.td}>{money(row.ending)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ============================================================================
// TOOL: Portfolio Review (AUM + add product + holdings)
// ============================================================================
function PortfolioReview() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "Exponential Returns",
    amount: 50000,
    fixedReturn: 8,
    exponentialGain: 12,
    lockIn: "12 months",
  });

  const summary = useMemo(() => {
    const total = products.reduce((s, p) => s + Number(p.amount || 0), 0);
    const groups = [
      "Exponential Returns",
      "Fixed Returns",
      "Hybrid Returns",
    ].map((category) => {
      const items = products.filter((p) => p.category === category);
      const amount = items.reduce((s, p) => s + Number(p.amount || 0), 0);
      const projected = items.reduce((s, p) => {
        const rate =
          category === "Fixed Returns"
            ? Number(p.fixedReturn || 0)
            : category === "Exponential Returns"
            ? Number(p.exponentialGain || 0)
            : Number(p.fixedReturn || 0) + Number(p.exponentialGain || 0);
        return s + Number(p.amount || 0) * (rate / 100);
      }, 0);
      const avgReturn = amount > 0 ? (projected / amount) * 100 : 0;
      const percentage = total > 0 ? (amount / total) * 100 : 0;
      return { category, items, amount, projected, avgReturn, percentage };
    });
    const totalProjected = groups.reduce((s, g) => s + g.projected, 0);
    const weightedAverage = total > 0 ? (totalProjected / total) * 100 : 0;
    return { total, groups, totalProjected, weightedAverage };
  }, [products]);

  function addProduct() {
    if (!form.name || Number(form.amount) <= 0) return;
    setProducts([...products, { ...form, id: Date.now() }]);
    setForm({
      name: "",
      category: "Exponential Returns",
      amount: 50000,
      fixedReturn: 8,
      exponentialGain: 12,
      lockIn: "12 months",
    });
  }

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div
        style={{ display: "grid", gap: 16, gridTemplateColumns: "2fr 1fr 1fr" }}
      >
        <div style={S.cardPad}>
          <p style={S.statLabelCream}>Total Assets Under Management</p>
          <p
            style={{
              marginTop: 12,
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: T.navyText,
            }}
          >
            {money(summary.total)}
          </p>
          <p style={{ ...S.helper, marginTop: 6 }}>
            Total client holdings entered into this review.
          </p>
        </div>
        <div style={S.cardPad}>
          <p style={S.statLabelCream}>Weighted Avg Return</p>
          <p style={S.statValue}>{summary.weightedAverage.toFixed(1)}%</p>
        </div>
        <div style={S.cardPad}>
          <p style={S.statLabelCream}>Total Projected</p>
          <p style={S.statValue}>{money(summary.totalProjected)}</p>
        </div>
      </div>

      {summary.total > 0 && (
        <div style={S.cardPad}>
          <SectionTitle>Portfolio Allocation</SectionTitle>
          <p style={S.helper}>Exposure breakdown by return category.</p>
          <div
            style={{
              marginTop: 24,
              display: "grid",
              gap: 24,
              gridTemplateColumns: "1fr 1fr",
              alignItems: "center",
            }}
          >
            <div style={{ position: "relative", height: 256 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={summary.groups}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={90}
                    outerRadius={125}
                    paddingAngle={2}
                  >
                    {summary.groups.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={
                          entry.category === "Exponential Returns"
                            ? T.chartExp
                            : entry.category === "Fixed Returns"
                            ? T.chartFixed
                            : T.chartHybrid
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <p style={{ fontSize: 12, color: T.textMuted, margin: 0 }}>
                  Total Portfolio
                </p>
                <p
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: T.navyText,
                    margin: 0,
                  }}
                >
                  {money(summary.total)}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {summary.groups.map((g) => (
                <div
                  key={g.category}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 999,
                        background:
                          g.category === "Exponential Returns"
                            ? T.chartExp
                            : g.category === "Fixed Returns"
                            ? T.chartFixed
                            : T.chartHybrid,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: T.navyText,
                      }}
                    >
                      {g.category}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>
                      {g.percentage.toFixed(1)}%
                    </p>
                    <p style={{ fontSize: 12, color: T.textMuted, margin: 0 }}>
                      {money(g.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gap: 24, gridTemplateColumns: "1fr 1fr" }}>
        <div style={S.cardPad}>
          <SectionTitle>Current Holdings</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {summary.groups.map((group) => (
              <div key={group.category}>
                <h3
                  style={{
                    fontWeight: 700,
                    color:
                      group.category === "Exponential Returns"
                        ? T.chartExp
                        : group.category === "Fixed Returns"
                        ? T.chartFixed
                        : T.chartHybrid,
                    margin: 0,
                  }}
                >
                  ● {group.category}
                </h3>
                {group.items.length === 0 ? (
                  <p style={{ marginTop: 12, fontSize: 14, color: "#7a7368" }}>
                    No {group.category.toLowerCase()} products yet.
                  </p>
                ) : (
                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          border: `1px solid ${T.borderSoft}`,
                          background: T.surfaceWarm,
                          padding: 12,
                          fontSize: 14,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 12,
                          }}
                        >
                          <strong>{item.name}</strong>
                          <span>{money(Number(item.amount))}</span>
                        </div>
                        <p
                          style={{
                            marginTop: 4,
                            marginBottom: 0,
                            fontSize: 12,
                            color: T.textMuted,
                          }}
                        >
                          Fixed {item.fixedReturn}% · Exp {item.exponentialGain}
                          % · Lock-in {item.lockIn}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={S.cardPad}>
          <SectionTitle>Add Investment Product</SectionTitle>
          <div
            style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}
          >
            <label style={{ gridColumn: "span 2" }}>
              <span style={S.label}>Product Name</span>
              <input
                value={form.name}
                placeholder="e.g. Bradbury A5"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={S.input}
              />
            </label>
            <label>
              <span style={S.label}>Category</span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={S.input}
              >
                <option>Exponential Returns</option>
                <option>Fixed Returns</option>
                <option>Hybrid Returns</option>
              </select>
            </label>
            <label>
              <span style={S.label}>Amount ($)</span>
              <input
                value={form.amount}
                type="number"
                onChange={(e) =>
                  setForm({ ...form, amount: Number(e.target.value) })
                }
                style={S.input}
              />
            </label>
            <label>
              <span style={S.label}>Fixed Return (%)</span>
              <input
                value={form.fixedReturn}
                type="number"
                onChange={(e) =>
                  setForm({ ...form, fixedReturn: Number(e.target.value) })
                }
                style={S.input}
              />
            </label>
            <label>
              <span style={S.label}>Exponential Gain (%)</span>
              <input
                value={form.exponentialGain}
                type="number"
                onChange={(e) =>
                  setForm({ ...form, exponentialGain: Number(e.target.value) })
                }
                style={S.input}
              />
            </label>
            <label style={{ gridColumn: "span 2" }}>
              <span style={S.label}>Lock-in Period</span>
              <input
                value={form.lockIn}
                placeholder="e.g. 12 months, 2 years"
                onChange={(e) => setForm({ ...form, lockIn: e.target.value })}
                style={S.input}
              />
            </label>
          </div>
          <button
            onClick={addProduct}
            style={{ ...S.btnPrimary, marginTop: 20 }}
          >
            Add Product
          </button>
        </div>
      </div>

      {products.length > 0 && (
        <div style={S.cardPad}>
          <SectionTitle>Product Performance Summary</SectionTitle>
          <div
            style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}
          >
            {summary.groups.map((g) => (
              <div
                key={g.category}
                style={{
                  border: `1px solid ${T.borderSoft}`,
                  background: T.surfaceWarm,
                  padding: 20,
                }}
              >
                <p style={{ fontWeight: 700, margin: 0 }}>{g.category}</p>
                <div
                  style={{
                    marginTop: 14,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <p style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>
                    {money(g.amount)}
                  </p>
                  <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>
                    Avg: {g.avgReturn.toFixed(1)}%
                  </p>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: T.success,
                      margin: 0,
                    }}
                  >
                    {money(g.projected)}
                  </p>
                </div>
              </div>
            ))}
            <div
              style={{
                gridColumn: "span 2",
                border: `2px solid ${T.gold}`,
                background: "white",
                padding: 20,
              }}
            >
              <p style={{ fontWeight: 700, margin: 0, color: T.navyText }}>
                Total Portfolio
              </p>
              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <p
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    margin: 0,
                    color: T.navyText,
                  }}
                >
                  {money(summary.total)}
                </p>
                <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>
                  Weighted: {summary.weightedAverage.toFixed(1)}%
                </p>
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: T.gold,
                    margin: 0,
                  }}
                >
                  Projected: {money(summary.totalProjected)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ============================================================================
// PROPOSAL BUILDER — generates print-ready client proposals (BOA Alphaline brand)
// ============================================================================

// BOA Alphaline letterhead background (logo + header + footer + watermark baked in)
const BOA_LETTERHEAD_B64 =
  "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laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwWP4laH9W2Pun8T4laH9W2Pun8TY3XwUsXFtYWPbsWKIt2bdMU0UU+kR9CqloAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACHIIiHJyCIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhM8eqWbkR9ozKcUpuzPp5JZqmfWW4ZzK01RHvSzdhSG4ZzJ5u/YhNypKGGZlHvq+lDmZ94DABoAAI90x75QAR76o96aLspBhmVSLv0wmi5TPvUQw3Mq8TEovnTRcqj38swrmVhTi7HvhPFUT6SxucogDQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEJngERTquxHp5pJqmr1luEzKrNyI+1Tm7M+nklG4TmSZmfUBrAAAAAAAAAAAAAAAAAAAAAAE1NyY+1PTcifXyUhmGxMvoFCKpp9JVKbsT6+TMKynAYoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQmeEtVyI9PNTmqavVuEzKeq79CnMzPrINTM5AGsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARpqmn0VKbkVfZKkMbE4fQKNNyafthViqKo8mYXE5RAY0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSque6PvGTOE9VcUqVVc1fwQFYRM5AGsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACJmJ8gBVpuc+U+Up3zpqLk0+U+cJwqJ71YQieUWLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEtVUU+qFdzt8o85UpnmfNuEzKNVc1fwQBSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE1uvt8p9FZ86pbr90/5JmFRPYqAMWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhM8AipV3PdH3oV193lHolbhEyAKSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAq0V90cT6p3zxPE8q1NXdCZXE5TAMUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhMxEcyBMxEcypVVzV/BCqqap+xBUQ5zOQBrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGmrtnlABXieY5hFRt19s8T6KyXSJyAMaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhM8QBMxEcyo1VTVP2FdXdP2IKiHOZyANYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKluv3T/kpjCJw+gS0Vd0famS6gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACjXX3T9iNyvnyj0SKiETIA1IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABTPbPKvE8xzCgmt1ds8e5kticKwCXQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASXK+PKPVGurtj7VH1bCZkAUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABUt18+Uqj5/RWoq7oTK4lMAxQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhM8Ryio3K+6eI9GsmcIVVd08oApzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEaau2eUAFeJ5RUrdfHlKqh0icgA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABLXV2x9oJblfHlHqpnqKcpnIA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFWiruj7VJGme2eWNicK4hE8xyil0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQmeI5Uaqu6eU1yrmeI9EioRMgDUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ7dXE8T6Kr51W3V3Rx70yqs9icBiwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABJcr4jiPVNVV2xyoTPM8thMyAKQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAET2zyAK8TzHKKjbq4nifRWS6ROQBjQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9BSuVe6BkzhLXV3T9iALcwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVt1d0fbCkjTPbPLGxOFcQieY5RS6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAITPEcyCFdXbH2qJVPdPIpzmcgDWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ7dXE8e6VV86tRV3R9qZVWexMAxYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAo3K+6eI9E9yriOI9VJsItPYAKSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI01ds8oAK8Tyip2qvdKoh0icgA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQqq7Y5RUK6u6fsayZwhM8zyApzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPRWpq7o5UU1FXbP2MlsThWAS6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJa6u2PtBLcq90KYKcpnIA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVbdXMce+E754nieVeJ5jlMriUQGKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQmeFGqrunlNcq5niEioRMgDUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACe3VxPCQYRs+gS0Vd0famS6gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACS5V2x9qaZ4jlQqnunlsJmcACkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI0VdtX2K751W3VzHH0JlVZ7E4DFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJLlXEce+Rk7JLlXM8R6JQU59QBoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAETxPIArxPMcnKgJwrmV+Y+mDmPphQDBzK/MfTBzH0woDcHMr8x9MHMfSoDMHM+gfOcz9Jg5n0Ch3T9Mo+0q+kw3mVhSi7P2Ixd+ww3MKgki5TP2JomJ9JYZRAGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAITPbHKhM8zzKa5V3T9iVUOczkAawAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGKpj0lNF2ffCQYZVouRP2JnzoxVNPpLMK5lcU6bv0p4mJ9GKicogDQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABJcq4jiPVNVPbHKhM8zy2EzIApAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARMxPkAKtNyJ9fJO+dNRXNP2wnConvVhCJiY5hFiwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAElyriOPeMnZJcq7p+xKC3MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGmqaZ+xWiYmOYUE1FXbP2MmGxOFYPUS6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIVT2xyoTPM8prlXdP2JVQ5zOQBrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFS1V7lR88TxKvTPMRKZXEogMUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJLlXEce9NVPbHKhM8zy2EzIApAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqWp9YU0aJ4qhhHVXAS6gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJLlXEce+Rk7JLlXdP2JQU5gDQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABXieYiUUtueaITIdQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEJniOVCZ5nlNcq5nj3QlVDnMgDWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKtr9VOp2vSVRMukdABjQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABJcq7Y498ppniOVGqe6eWwmZwgApAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACra/V/wA06S3+qnTLpHQAY0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABLXV2x9oJLlXM8JAU5TuANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFajyphMhHlCKHUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABD0Uaqu6eU92r3KaoRMgDUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqW6PLmfekrp7Z+xjcIANYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI0RzVCCe1HzplhHVVAS6gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACWqrtjlMo11d0/Y2GTOEvqApzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE9ujmeZ9EtFPdP2K0RwyVRCKFVPdHCIlb55jieJFW5RzHMeqkpzmMADWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACrajin+KkrxHERDJVVEBKwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEJntjkEtyriOFImeZ5FOUzkAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABEczxAq26O2OZ9WNiMpqae2OEQS6AAClco4nmPRVQmOY4ayYyoCNVPbPCCnMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABNbjmr+CsktRxTz9KdMrjoAMUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKVyrmePdCa5V2x9qk2EWnsAFJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARop7pBNbo5859FVCI4RQ6RGAAaAAAAlrp7o+1R9H0Kdyn3w2EzHapgKQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAERzPAntR58sI3VIjiOEQS6gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACEzwip3avcMmcJKqu6eUAW5gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAERyrU09scIW6OI5n1TplcQAMUAAAAAAAAo109s/YlV6qe6OFCY4niVQ5zGABrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABWojtpiFO3TzV/BWTK6wAMUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlqq7Y5UZnlNXV3T9iVUOczkAawAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATW6e6efclpjunhXiOI4ZLYjKICXQAAAAAAAAAASXKeY5j1Tgyd3zia5TxPMeiVTn0AGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACainuq+wFSintp+1MCHUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASXKuI498ppniOVGqe6eWwmZQAUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABPbp5nlh1TUU9sfanBLqAAAAAAAAAAAAAAhMcxxKjVHbPCulrp7o+1sJmMqICkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACtRT20/ap26e6r7IVkyqsADFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJaqu2OQSXavckBTlO4A0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARpp7p4VojiEKKe2PtTJl0iMADGgAAAAAAAAAAAAAAAKVynjzhIrzHKjVT2zwqETCADUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ7dPM8/QwT0U9tKYEuoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAo11d0/YnuVcRx75Umwi09gApIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnt0+9LTT3TwrRHDJVEIgJWAAAAAAAAAAAAAAAAAAJa6e6PtTAPn9BUuU++FNTlMYAGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABEczwr0x2xwktU+9UTK4gAYoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQmeI5RUrtXuGTOEtU908oAtzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT26fewiMp6Ke2PtTAl1AAAAAAAAAAAAAAAAAAAAAAFCuntn7FdLVT3Rw2GTGVEJjgU5gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKturmOPoTqFM9sxKumVxIAxQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACFVXbHKhM8prlXM8e6Eqoc5nIA1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACNNPdPCtEcIUU9sfamTLpEYAGNAAAAAAAAAAAAAAAAAAAAAAAAU7lPvhTfQoV09s/YqETHagA1IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAq26uY4+hSRpq7Z5Y2JwrgJdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABJcq7Y+2U6hVV3Ty2GTOEAFOYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnt08zylpjunhWiOI4ZKohEBKwAAAAAAAAAAAAAAAAAAAAAAAAABLVT3RwmAfPMcCpcp584U1OUxgAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKturmnj6E6hRV21cq6ZXEgDFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAITPEcgku1cRwpkzzPIpzmcgDWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJrdPM8+6GCe3T2x9qcEuoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoV09s/Yrpaqe6OGsmMqITHApzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFW3VzT9sKSNFXbV9jJbE4VwEugAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApXauZ4T1VdscqPq2E2nsAFIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIjmeFemO2OEluniOVRMriABigAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFO5T71N9ChXT2z9ioRaO1ABqQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFW3VzT/AATqNFXbUrJlcSAMUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlrq7Y+0FO5VzPHuhKC3IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARop7p+xBWop7Y+1ktiMpgEugAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlqp7o4TAPnmOBUu0+9TU5TGABoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK1FXdSoprdXFX8WS2J3VgEugAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoV1d1Spcq4jj6VJsItPYAKSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARHdPAJ7dPM8qqERxHCKHSIwADQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD1UK6e2VdLXT3R9rYZMZUQFOYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACtRV3UplG3VxVx9KsmXSJyAMaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIeiKndq8uBk7JKp7p5QBbmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKtuniOffKSinun7FZMqrAAxYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAClcp484SK8xzCjVT2zwqETCADUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACtTPdTEqKe1VxPH0slsTuqgJdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEJniOVCZ5nlPdq9yRUImQBqQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE9unmeWHVPRT2x9qYEuoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlrp7o+1MA+cT3KeJ59yRTlOwA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAV6Z7oiUVK1V58KqHSNwAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIVT2xyipXKuZ4+hrJnCSZ5nkBTmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARHM8K8RxHCS1T5cqiZXEADFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAITHMcKExxPD6ElynmOY9WwmYUgFIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAInieVeJ5jlQVLVXuZKqyqAJWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlrq7aeVFNcq5q+yEqoc5nIA1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjTT3Twgq26eI+2WNiMpwEugAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACjXT2z9iVXqp7o4UJjhUOcxgAawAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIniYkAV4nmEVO1VzHH0KiHSNwAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJa6u2n7UyjXV3VfY2GTOEoCnMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABNRT3VfZCslop7YTJl0iMADGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhM8RzKlXX3eUejWTOE1dz3R96mDXOZyANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEaZ7ZiVd86rbq5p4+hkqqnASsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABLXV20/aopq6u6pKqHOZyANYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ7dPM8/QkiOZV6Y7Y4ZLYhEBLoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJaqopjzQruRT5R5ypTPM8y3CZnCNVU1T5oApAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjRV21fYgA+gS26uaf4JkOoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAluVcU/wAUyjXV3VNhkzhKApzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIjmeAVLVPvVEIjiOEUOkRgAGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAITMRHMgipV3PdH3oV1938EqsImQBqQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE1urir+Ks+dWonupiUyuspgGKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAS3KuKf4qKauruq+xKqHOZzIA1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqWqfekpjumIVojhkqrCICVgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKddzjyj1GZwmqrin+KlVVNU+aHqKRM5AGsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE9uriePpSDCH0CFM90RKKXUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAS11dtKZRuVc1fwbDJnCUBTmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjTHdPAKluniOfpTgh0jYAGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACEzwhVVFMealVVNUtwyZwmruc+UeUJAa59QBoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAntVe5VfPE8TyrxPMcpldZRAYoAAAAAAAAAAAAAAAAAAAAAAAAAAAAABLXV20qKa5VzVx9CVUOcyANYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKtuniOfpU6ae6rhXZKqwAJWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAh6AikrudvlHqlruc+UeiRuETPcTPM+YCkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACpaq8uFNGme2YljYnCuAl0AAAAAAAAAAAAAAAAAAAAAAAAAAAAEKp7aZlFSu1czx9DWTOEgCnMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGinuq4BUt08U8/SnBDqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkruRT5R5yM6JqqopjzUaq5q/h9CEzzPMisImcgDWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKturmnj6E6hRV21K6ZdIkAY0AAAAAAAAAAAAAAAAAAAAAAAAABCqeImVD1T3avckVDnMgDWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACrbp4p5+lTpjuq4V2SqsACVgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACHoVVRTHmo1VzV/D6G4ZM4TV3OfKPvSA1zzkAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACtRV3UqKa3VxVx9LJbHVWAS6AAAAAAAAAAAAAAAAAAAAAAAACEzxHKKldq9wyZwkmeZ5AW5gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI0x3TwCpbp4jn6U4IdIABoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACEzwCKSq5FPlHnKWq5z5R6JG4RM9xM8zzICkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK9M90RKKlaq8+FVDpE5ABoAAAAAAAAAAAAAAAAAAAAACEzxEyoTPM8p7tXuSKhzmQBrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABUtU8Rz9KnTHMxCvEcQyVVhEBKwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAElVzjyjzGdEaqop9VKqqakJnmRWETOQBrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACJ4nlXieY5UFS1PlwyVVVAErAAAAAAAAAAAAAAAAAAAAEJniJlFTu1e4ZOynM8zyAtzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIjmeAVLVPvVEIjiOEUOkbAA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQmYiOZQqrin+KlVVNU+bcJmcI1XJq8o8oSgpHUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARpntnlAB9AktzzTx9CdDqAAAAAAAAAAAAAAAAAAAAhM8RyoTPM8ql2r3KaoRYAakAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT2o8+UivTHbHDJbEIgJdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEKqopjzBFTque6PvS1VzV/BKrCJnuAGpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACI5niCI5nhWop7Y+1jYjKSujtiJ+9IrzHMKNUds8ENmMIANSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAmoq4qVnzq1E91MJlVZTAMWAAAAAAAAAAAAAAAAITPEIqd2riOPpGTspzPMzIC3MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABNbp5q5+hWS0U8Upky6RGwAxoAAAAAAAAAAAAAAAAAAAAAAAAAAITPEeanVc59PKBkzhNVciPKPOVKZ5nmQUiZyANYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAERzJEcqtFHb/FjYjKNFHb/ABTAl0ElynmOfoTgyd3ziNVPbVwgtzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE9uriePpSHowjZ9AhE8xEopdQAAAAAAAAAAAAAAABQqnuqmVS5VxT/ABUmwi0gCkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACNEd1UQgqWo8uWNiMqgCXQAAAAAAAAAAAAAAAAAAAAAAAAAAS1VxT/ABS1XPdH3qbcJme5Gqqap80AUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPUVaKO3+LGxGSijt/inBLoAAAAkuU8xz74Un0KFdPbV9jYRaO1ABSQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFS1PrCo+emeJiX0JldQBigAAAAAAAAAAAAEtc9tMyCncq5qSgtyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIjmeFeI4jhTtR58qqZXUAYoAAAAAAAAAAAAAAAAAAAAAABTquceUeYzOE1VUU+qlVXNX8EJnkVhEzkAawAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVoo7fOfVjYjJRR2+c+qcEugAAAAAAlrp7qftTAPnE1dPbV9iVbkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKturmOPoUkaJ4qhktjqrgJdAAAAAAAAAAAABSuzzPH0KkzxHKhM8zy2E2AFIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARojmqAVaI4phMCHUAAAAAAAAAAAAAAAAAAAAAAQmYpjzS1XIp9POVKZmZ824TMpqq5q+yEoKQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAq0Ucec+rGxGSijjzn1Tgl06AAAAAAAAAAJa6e6lRfQo3Ke2r+LYRaO1KApIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACtRPNMJlK3VxPH0qqZdI3gAY0AAAAAAAAABTuz5cKaNc81SgqHOd5AGsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFS1HlMqavEcREMlVUQErAAAAAAAAAAAAAAAAAAAS1VxT9sgjMxEcyp1XJnyjyhLVVNU+aCsOcyANYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAq0Ucec+rGxGSijjzn1Tgl06AAAAAAAAAAAACWunup+1MA+cTXKeKvslKtyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFemeYiVBUtVe5kqqqAJWAAAAAAAAJa54plMpXZ84hsMnaEgCnMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABNbjmr+CsktxxT/ABTpl0joAMaAAAAAAAAAAAAAAAAITPCWq5Eenmp1VTVPm3CZlNVc58oSA1HUAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeqrRR2+c+rGxGSijt859U4JdAAAAAAAAAAAAAAAAEtdPdT9qi+hRuU8VfxbCLR2pQFJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACmeJiQB9Akt1cxx9CdDpAANAAAAAAHz1TzMyrXJ4p/iothFgBSQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiOZ4E9qOaufoYKkeUIgl1AAAAAAAAAAAAAQmeARFOq79HmkmqavWW4TMqlV2I9PNTmqavVAamZyANYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAERyRHKrRR2/xY2IyUUdv8U4JdOgAAAAAAAAAAAAAAAAAAlrp7qUwD5xNXT21fYlW5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI0TxVCu+dWonmmEyqspgGLAAAAAAUrs8zx9CQmeZmRTlO4A0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFW3HFP8AFSiOZV4jiGSqqICVgAAAAAAAAJZqin1kEyEzEesqdV2Z9PJJM8twmbKlV36FOZmfWQajOQBoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAERzJEczxCtRR2/xY2IyUUdv8UwJdAAAAAAAAAAAAAAAAAAAAAAEtdPdT9qi+hRrp7amwi0dqUBSQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABPaniePpSEeUsI2fQIRPMRKKXUAAAAS1zxTKZSuz5xDYZPRIApzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATW45q/grJLUcU8/SnTLpHQAY0AAAAEs1xCSbv0NwzMKqSq5EfapTVM+o3CeZNNyZ+xKDUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABEczxBETM8QrU09sfaxsRkpo7Y+1MCXQAAAAAAAAAAAAAAAAAAAAAAAASXKeafthOA+cRrp7akFuQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACpan1hUUKZ7ZiVdMrgAYoAAUK55qlWmeImVBsIsAKSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARPEwCvTHERCKn7X7EJuz9icLzCqKM3Kp96XmZ95g5laa4j3oTdj3RypDcJ5pTzcn+CWaplAGZAGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARE1TxCNNM1TxCtTTFMcQzLYjKFNMUwmBLoAAAAAAAAAAAAAAAAAAAAAAAAAAAAkuU808/QpPoUKo7aphUItHagA1IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAq255p/gpJrc8VfxZLY6qwCXQABJdnilST3Z84hIqHOeoA1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjTTNU8QU0zVKtERTHkzLYjJTTFMcQiCXQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASXKeY5+hODJ3fOI1R2zMILcwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFeme6mJRUrU+cwqodI3ABqhXPNUoHqLcgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGmnun7EaKO7+CrEcR5MmVRGSIiI4hEErAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU7tPlypq8xzHChMcTwqEWgAakAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAieJ5V4nmFBVtVcxx9DJVVOAlb5wFuQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAmoo7vX0Roo5859FVkyqIQiOEQSsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU7tPvVEJjmJgZMZUAmOJFuYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjRPFUIAPoEtM80xIh1UQFuQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnot8+co0W/fP3KiZlUQAMWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApXaeJ5SK9Ud0cKCoc5gAawAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABUtT6wJaPUZhUSlAakAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9QFSi3x5z6o0UdvnPqnTMriABigAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSuRxVz9Kqlrp7qWwyYyogKcwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE1HqFHqDYSgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACImZ4gCI5niFaijt/iU09sfamTMriMADFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKNynir+KVWuRzT/BRVDnMbgDWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJqPUKPUGwlAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI00zVIFNM1T5K1NMUwRTFMcQinK4jAAxQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoV09tXCukuU8xz9DYTPRSAUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABNR6hR6g2EoAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABNRR3ec+jAoo7v4KsRxHEHoix0iMADGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKFUdszCCpdjy5U1OUxgAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJqPUKPUGwlAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKlFvjzn7mERlCi3z5yqgl0iMAA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABCY5jhQmOJ4fQpXafPlsJtCQBSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE1HqFHqDYSgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiOSI5niFaijt/ixsRlCi32+c+qcEugAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhVHdEwiA+cT3I4q5+lIpy6ADQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABNR6hR6g2EoAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARppmqfIppmqfsVopimPJmWxGUKaYphMCXQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABLXHNMqL6FGuntqbCLQlAUkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABNR6hR6g2EoAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATUUd38EaLfPnPoqsmVRCERxHkiCVgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACS5TzTz9CcB84jVHbVMILcgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE1HqFHqDYSgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACI5kBUot8ec/cjRR2+c+qdOVxAAxQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACndjy5U1eY5jhQmOJ4VCLADUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJqPUTWo9ZGZVEKYDUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI00zVIIRTNU+StTRFMfajTTFMcQinK4jAAxQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApXY8+VVCqO6JgZO6gAtzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARojmqAVaY4piBMIdXzgLcgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE9Fvnzn7mERlCiju8/cqxHEeSIx0iMADGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKVyOKufpSK1cc0yoqhzmABrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVtU8Rz9KlTHdPCv6MlVYRASt88xxMwJ7scVc/SkU5ADQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPUiJmeIVqKIp/ixsRlCi3x5z6pwSvGAAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKNcdtSskuU808/Q2EzCkApAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACNNPdPAJ7VPlyqIRHCKHSNgAakuRzT/BSfQoVRxMw2EWQAUkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARppmqUaKO7zn0VYjhmVRGSmmKY8kQSsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABZ9U3joOh5PwfUda07AyOO72WVl27VfH08VVRLYiZ6C8Dzf+kraX7UaL/UbP5j/AElbS/ajRf6jZ/M3lt3MzD0g+TTNWwtZxYycDLsZ2NVPEXsa7Tcomf40zMPrS0AAAAAAAAAAAAAAAAAAAAAAAAABQqjtmYQVLsekqanOYwANYB5/RV90nv8AtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVbdPEc++Ulunun7IVkyqsdoAxYAAp3afeqITHMcDJ3UAmOJ4FuYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABETM+QCpRb98/cmpoin7ZTJyuIAGKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYb8XvVPU+jXh63bujRKot6xYs28fDvTTFUWbl27Rai5xPlPb3zVEfTENSPCn4PujfiR6Y2t37j17WN47xyLszrdVzUKrVzEyJmZ9nVT+tPl5xXVM93rHEeUZ9/tJZmPCDvKYniYuYcxMf/RNthLcXQjdnh/0XafXbonaqquTomFd3PtOiJmzm2fYW6rlyiin1ifOqqmPnUzzXR/tRP2OG20MVty2mdp+6I2n83h1d9TeMxEMrf8AuX3Qr6q1j+q3PwP/AHL7oV9Vax/Vbn4M09AfEBtbxE7Ex9x7byO25HFGdpt2qJyMG9xzNuuI9Y99NUeVUece+Iwh4ovFJrmRuq30Z6L0TrPUnUpmzmahjTE29HtzHzp7/SLkRPM1T5W4855qmIcqanF2v6vnmJjrv0+9c10YrzYhr9VlbZ8HXjK2ptnpVufP1HRNUyrOnbk27fve2s41d25FFNPf5RVcjuiv07qJjiZmKpiOncTzDmT1d8MWjeG3O8PePbvzq+6tU3javazrd3ma8m532Z7aefOLdMzPET5zMzVV5z5dNqfT/OTjZraKXrOdp378S3QiYm0Tt9iL4NM17TNbuZtvTtRxc+5hX5xsqnGvU3JsXo4mbdcRM9tUcxzTPn5vulqVj9dsDpb058Qu89C2Tp2Fl7a3ffs5Vm3l3IjVb01WKKsm7VNM9lcxc/VpiY+bH0vFp6c6mYjrt4y72tFerbYap7h8T3VTZFO2N27k6c6TgdOdf1PFwbdFvVKq9Yw6MmqKbN29b7fZ8z3RM0UzPbzxM8so9KOtmZvfqX1M2TrelWNG1baOdaptRav1XIzMK9b77OR86I7ZnieYjmI8vPzVbQvWObs+9kalZnDLY1RseNfPztg5W4NO2bGqZmtbpv7a2XpmNmTFesezmaZyblVVPFu3E01TMxz5R6r/ALf8QXUTZnU3a+0eruzNI0Sxuu5VjaPre3tQrycaMqKe74NeprpiqmqY9Ko8pmPLy5mNnhtSM5jx7urPW1lseg1Tp8S/VvqDf3nq/TLp5oetbT2vqOTpldOpapco1LUbuPPF2LNqimYp9J7Yq86vLjn0eX8RXUrqJru8PDvrG39sU6TTqmoU5VjSda1C9g5E51WNc78PLtxR82imnz7+KpmqP1YXXhbzbEzEfjHdlk6sYzDdOqqKKZqqmIiI5mZ9zH2Z4iOluna1+iMrqLtbH1Lu7JxbmsY8V01f4Zjv8p+yWDOpmqan4heqWr9P9V1a5tjptsjTMfUd73dOyqqJz8q7b9rThe2jiqLFFFNVVcxxM+k+7jH17eG0dO6Q5W88Dw07cq6G49urjMypx7eqZWPz7OjLox6rcz2TVNPnVc7+J7o5XThomI5uv4dvTr2z3Jtq9zfLFyrOdj28jHu0X7FymKqLtqqKqaon0mJjymHyaLuDS9x4teTpOo4mqY1F2uxVew79N2im5RPFdEzTMxFVM+Ux6xLTXw93NU6HdYtgbcwMbN0rp11R0W9q2n7Xzcucudv51q1F+5ZtXJ85tzbqjy4jzmPo5nzfhY6g9XbGyd3aT002Jo2sYWlbn1e7lajr+pVY1OVeuZNVcY+PTRTPNUUzHNVUxETVEE8LtMxPd9nfH6wRrdMw3+GsUeNvByug+nbywtrZuRvDUNZna+PtD2sRe/S8VTTVYquceVMRHdNXHPHu59Po0vxC9Stg9Qdo6B1e2XoujaZuzJ+AadrO3dRrybWPmTT3U4+RTXTExNXpFUTxzHviJ44+zam+Y7/DrhfratlRr1ufrF1e3F1G3Pt3pp0+0u9pe3KrdnI1rdeXexLWbfqo7poxqaKJ7oj0mvnjn/JLtXxW5Wu+HLXeol3Zefe3DombkaRk7a0yucmu7nWr0WZotV00zM0TVVE93HlEVevHnnqL4ifu7Y7ejfWVzhsO+DH1/TMrWMvSbGo4l7VcSii7kYNu/TVfs0V/qVV0RPNMVcTxMx5tbavED1i6e7m2PT1L2Dt3T9vbq1SzpFu7oerXL2VgZF2Jm3F2mumKa48p5mmfLiVw6bRHy5us08Rz8X9E/wDRcV6iYiZmezO2/bEJ9ZEzEQ2RGKvEH1wnovoGj06do1e5d17h1CjSdD0W3eiz8Jya4mea65ie23TEc1Tx9H08vIbH659RdH6qaPsjqrsvTNGq17Ev5Ol65t3MuZOF32aO+7Zvd9MTbqimeYqmeJ48vVFdG9q80fzCpvEThsINTtO8TnV7qTomsb26bdNNI1bp9g371GHVqup12NR1e3Zqmm5dx7dNM00xPbV2xVzMzHHnPkvG7vGZTY6a9Kd47P2td3Pb33qcaZa0urJixkWr027n93zxNPdF232TM8REc1fYv2bUzjHjHj3M9bXq2ZGpeV4k+te3epmJ041jprt3L3druBOfol7S9ZufALdFFUxenKuV0d0Rbj/BTzVPERHzolkXoF1r3Zvneu+9j7827p+hbr2pXi13Lmj5VV/EybGRRVVbromuIqieKfOJ+n3TEwy3D3rXmnGOvWOhGpWZwzeA8zqhMcxwoTHE8PoUrscTz9LYTaFG9eox7Vd27XTbt0UzVVXXPEUxHnMzM+kNDOuHij3z1R2nvbcHTvV6tjdJtr012b+8Itd2breXzFFOPhRP6tM11Ux3xxMRPMzH6rOHjy3fqO1/DlrGHpFdVnUtxZmJt+zdoniafhN2KK/voiqn/wAprB158Mm7um22uk/TWrq7qWs7b13cmLo+LpFzSsexj4UxFVyL1MU/Or7auZ4qniZnz5fW4TTpte+MzO2e6N5/kvHq2t0r/O57TpP4ALm9uk9jXuoG+N2WuoGs49OZRfs6rdmjTpqjut010zPN2riYmvmY9ZiOOOZ8N0R3/wBeujVnekTq9/qHj7C1KcPcuzdSrqu5dGJMTNGZg36uapommKp7Z9OOe2Yny2Snw09Y+Z//AEnNy+v1DhfgwXR0Q6j7c8Y9zbeN1t1uxru49q/pTK3Nb0rG9tfox7tNqmxXa/U4jy4qjifLh6KasanNF7xMdcYnbw7u5zmnLjliYbx9MepWg9XtjaTu3bWX8M0jUrXtLVUxxXRPpVbrj/ZrpmJiY+mHqWnng425qXQvrj1V6O5msXNfwrFjD3Lh5tdiLHdVfjtvT7On5tPNU0xxT5fM58ueG2W4tbs7a0DUtXybd69j4GNcyrtvHo77lVFFM1VRTT5czxE8Q+VracU1OWu8dn4vTS0zXMriMM7p8WnT/aHRPQOqmdkZ9W1tbqtU4fscXuyKqrkVeVVvu8pp7Ku7z8uF7394gdrdPczamJl06hqeVuexkZWm2dLxvbVV2bNj29y5VHdHFMUTz9von1Wp3d/h1bzV72Sxhncvi12BtTojoXVXOv587V1qq1RiRZxu7Jmqvu+bVb7vKaeyru8/Lhe99+ILauwMnaONlU6hqOTumzfydMs6Zje2quWrNj29y5VHMcUxRMTz7/Q9Vqd3f4dTmr3sljDG4/FrsDa/Q7ROq+bfz/irrFVqjFi1i92TNVc1R21W+7ymnsq7vPy4eo3B1u21t7XtgaPdry8vN3vXVTpFOJY9pFVFNqm7VcuTzHbRFNVMzPn6s9Vfu7/Dq3mjve/Gt/jl3hVsbp/sbWatUv6RhY+9dKrzcixcro/5NFVdV2Ku3zqp7Ynmnz549F02v4zNoa/vHRNv6nt7d2zqtfr7NF1Dc2kTiYmo1T50xar7pmJqiYmIqiOeY+lcaF7Ui9Yz18E88RPLLPgwr1E8Vm29i75ytnaft7dO+tyYWPTlahgbT0z4ZVgW6o5pm9VNVMUzMcTFMTM+cfSvG3PEv0/3L0i1LqTZ1irF2zpcXI1GrMsVW7+FcomIqs3bX60XOZiIpjnnujjnlPqdSIieXq3mrnGWUhr3oPjW2rqmsbexdU2jvfaWm7gyKMXS9c3BovwfByrlz/VUxciuqae/y45iPWHpuqPia270z3pjbOtaJuPeW7b2L8Or0ba2nfC79jH5mIu3eaqaaaZmJiPPlvqNSJ5eU564zll4a2758QGj9X/C91e1XbM6voWr6FpObi52BqVirD1DTsmLM1RFVMT82ePOJpn3fTDL/RbJu5nR3YuRkXa79+7oODcuXbtU1VV1Tj0TNUzPnMzPvlltK1K5t34ItEziHsxhHqB4s9s7I3pqW1dP27uvfOtaTZpv6rZ2npfwynTqao5iL1c1UxFUx59scz9j787xW9OMHo5hdTP0xdyNuZt2MbFt2MaqrLv5M1TT8Gps/re15iYmmfTjnnjzb6nUxE8vU5697L4wr078Vm2t973xtn6ht/dGxdy5uPVlYGn7s0z4HVnW6Y5qmzVFVVNUxETM0zMT5T9C17i8Z20tH1/c+h6XtreO7NY2zlXcfVsTQdH9v8FptxEzeqrmumn2c8zEefdPbV83iOT1Gpnl5TnrjOWfhrRkeP3p/Vtz4yaXoG8tf2vYt269R13TtFmrE0yqrjm3frqrp+fTzHdFEVRHMefnDYzSNVxNd0rC1LAvU5ODmWKMmxepiYi5brpiqmqOfpiYlN9K+n/nGCLRbpL6wHNYAAAAAARHM8CrRT2x9rGxGU1MdscIgl0AAAAAAU7tPvU1eY5jhRqjtnhUImEAGpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVKbf0/cwiMpaaJq/gqxTFMeSIzLpEYAGNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaw/2k3/agbz/APCYf/tNtm3o359Itk/R+g8H/wBntqXWfpXpvWvphuDZWq3K7GJq2P7L4RbiJqs3Iqiu3ciJ9Zprppnj38ce9qJs2/4vvD/oGNsjT9l7f6g6NpdPsNP1evJjumxT5UUTzet1cRHlEVU8xHlzMREvfp1jV0fVxaImJzvt1iPJ57TNNTmxtMPf9Tv7O7ae7N55u59obn1zpvqOo1TVnWtCriMe9M+dU00c0zR3TzMxE9vMzMUxzLKPh38Ley/DbpGXZ29av52r58xOdrWo1RcysjjzinmIiKaOeZ7Y9/nPM+bBf+nDxjfuS29/9Vf/AJ0f6cPGN+5Lb3/1V/8AnTtanEXpyW1Ix/8AdDnE6dZ5orOful9X9oFP/wAP/Dr/AOOFH/r2W5VPp/nLSnYvQnrH1961ba6idcrGnbb0fa1fwjSNsabcivuv8xMVVcVV9sd1NNVU1VTVV2UxERDdb0efiOWtKacTmYznH2y66eZm1sYyS5/7529qt3w8eLTHo0vNrv5e9713GtU41c136Pa4vzqI45rjynzjmPKXQFDhy0db1U5x3eE5XenO1o8Z2l5mo9Ctp2MTDyMq9RuXQa6rVi1VXVTTTkUTVMxETMREes+54Lxp6Zu/px1L07fOwtJydT1DeOg5WyM6jEtVVeyvXJirEyK+2J/VmquOZ4iO31bqcExyvT4j1eNs4z+OU20+bO7SLxK+H+z096V9EfgmmaxrO1unuT7HWrO3b121nfBrtqKb2Vam3MV90XKe+e2YniqftWjp3pvSbqF1t2JjdONF3rvmnS8v9L5uva5rmqU4OiVW6Zm3PZf5i7dqq+b2eX2z68b6JaLVFqJiimKYmeZiI481xxVuTlnOd+3v70zoxnMOce8Nb6T17m3tn7k07efRDq7jZ+TTFvZ1zMn9KVRMzZyKKaKPZXZueUzHEev63ny9fvfdm6NA6feFbeXVinLwtR0zXqsjXcy7iVVV49E2L1Nqu/Rbpmaa5o7O6OP1pny58m9tVqiqumqaYmqnniZjzj+CNdum5T21UxVH0THKp4qNv7fH7MYjbaPzZ6md92iu5sbD0bqp1r2DrWq0aDpHWvSreobX3HlzNvHryJxvZV49VU/q1c1UzFM8Txx75iDqDszr3vzw26P03/0Zafp9jRLeBZ1Sm3rlmY1uxjV0cWcammPmRXFFNVVVcxxxxTzMtxuoPTXa/Vbbl7Qd26Hh69pN2Yqqxsy33RFUelVM+tNUf4qZiWFqfAT00iicarO3jXpMx2/oid05nwWKfo7Yr54+znh0pxNNpt1jHZnptnrHYm2lbeI6fz70/Tbp7vXqJ1owOqPUDQbGzcPb2n3NM2ztW3l0ZV2xN2Ii/k366PmRVNMRRTRT6U+vp54S8MniT0Hw97T3hoPUHSdd0Kq7uTVdS0nIp0i/do1O3XkVRNFuaaf9ZTVTMcVccxNM88N79L03H0bTcTAxKJtYuLZosWqJqmqaaKaYppjmZmZ8ojzmeVeq1TXx3UxVxPMc+fE/S8/r4mJreu23TbGPz73T1cxiYndzrx+nG9dD6Wbe6xZW1NRnIx+pl/fmXtmzbmcy1pl2n2XMWuOe+mniuafXiefp4yL1I6t6R4t98dLtpdOMXUtXxNK3Fi7i1vWL+nXsaxp1jHiaot1VXKY5uVTPb2w3R4Qot02+e2mKeZ5niOOZ+lc8VzTzTXeM4/HyZ6rEYidmgG4d3bd1jrH1KwOuu4t942Vh6vVZ23tPR686zhZen9tPsqrNGLEe2rrnmJmqr3/d4/ppvvcuy/CR1H2/s3B13au5tG3hcv6tg4+Jcq1DSdJyL8d1Vqao+fcot0TTMxzMdszPHlLpdVbpqrpqmmJqp54njzj+CMUU0zVMRETV5zMe9UcXGIjl7u3bb7MdrPUznOe9zD6max0m0zUunm69kX98b0t6HuXAzde3brFeo5tvCsRVPNufbRFPta6vOabdPlFE+nMROz+ydV/Rvit607tjCzsrRvippGbYu2cavnJpotXLk02u6Iiqvjj5vPPMxE8NnIs24t9kUUxR/h48vuTcJvxMXry4npjeftie77G10sTnLULrxu7L3joPQ7rxou2Ndv6FtzVbmfqWjXcTjUcfDv25tV3ZsUzPNVE0xPETPlVy9bofibs9euoem7Q6b6bf1jat7T8qvcW5MzCv41rA7rU02LVrvimK7tVczzTMTxH8J42Q48ktFqi1HFFMUxzzxEcOXrqzXE16Zxv3/rhfJOc5aQdC/E1o/hr6LWumm+tG1nA3/tT2+DY0fH0y/d/S3N2uqzXj3KKJpqpriunz5+33rLtrpPuXp9048K2mazpmTa1enflWq6jiUWqqvgMX7eTcimviJ7O2K6YnnyieYb81Wqaq6appiaqeeJ484/gm4dJ4mImZrXrOZ3+yfNEaU7RM9Gue89NzLnjm6aZtGJfrwrW0dVt3Mmm1VNqiqbtvimauOImfdEyrdKdOy8fxj9dcu7i37eJfwNCizkV2qqbdyaceuKopqmOKuPfxPk2GOHH139vLjsx45Xyb5+3PhhEB53US1R3UzCYBrl48dn6jurw5azl6RRVd1Pb2Xi7gs2qImZr+DXYrr8o+iiaqv/JardcvE3vvqTtjpX1Lv9JL+j7a0LceNrGFrH6Ws37GbVMVWos+XzrfdVzHNUeU0+fDpbk2KL1Fdu5RTct1xNNVFccxVE+UxMe+Gh3XDws756ZbU3toPTjS/jr0o3RRXeydmTd7czRsrmKqb+DVP60RXFNXZ6zEcTE+VT63CalNqXxmJ2z3T1/kvDrVtvMMm/KS68c/9rLq3/8AMGL+LB9HW3qtuTxg3Nx43RPUL+5NubX/AEXlbZt6tY77FvIu03ab1d39Xz8uKY8+J5ei6UePjM2J0nsbf39sHdt7f+jY1OHZtWtKuxRqM0x226q6pp5tVcREV8xPpMxzzxHieiPTrr31jx95+10q907xt+alOZubeGpW6rWZdxeJpow8KxVxVTRFM1R3TxzE8d0RHE+mmnGnzTekRHTOZ38e7uc5tzY5Zmfy8mY/BjuLVuunWvqp1i1LSP0DjX7OHtrEwqb8X6aZsfOvRFyI4r4q7Z5jy+fMR6czuJcopuUVUV0xXRVHFVNUcxMT6w8x0y6baD0i2NpO09tYnwLR9NteztUTPNdc+tVyuf8AarqmZqmfpl6l8rWvGpeZrGI7Puh6qRNYxPVzW2H08r371Pt+HLU8eq7ouxNS3HqU+2jmicfIsxTp8/8Ak1ZVVX28Q9l4IczUOsXU/SdW1zHuVT0w2fb2nc9v586hXfuUXavomfY2Yj/yphvDjbS0PC3Hmbgx9G0+xr2bapsZOqWsWinKv26eO2iu7Ed1VMcRxEzxHEfQhoO0dC2rcz69F0XT9Ir1C/OVmVYOLRZnJvT63Lk0xHfVP+KeZeq/F89ZjHWPHt/PLlXSxMTn+djnfsTp7Xvfqta8OWpY9y5omx9W3Fq0+1p/u5xr9iKdP4/72vKqq+3iHrvBDlaj1d6o6NqOt2LtU9LNoU7Vue2nnnUK7923cq+2fY2Yjy+nhvHjbS0PC3Hmbhx9G0+xr+ZapsZOqW8WinKv26eO2iu7Ed1VMcRxEzxHEfQhoW0dC2td1C5oui6fpFzUL85WZXg4tFmcm9PrcuTTEd9U/wCKeZL8XzVmMdY8e388ldLExOf52OeOxtgV7x6uWvDhqWPcq0LZmtbg1mYuRzbnEv48Rgcf97XlVVcT9ES9N4KNSzupnU3RtT1+m5Zt9Itnztu/dyJ8qc+q/douV8z9FixxzH2t6cbaWh4e5MvcOPo2n2Nfy7VNjI1W3jUU5V63Tx20V3YjuqpjiOImeI4hJpGy9vbf/Sn6L0LTdN/Sl2q/n/BMS3a+F3Ko4qru9sR31TEzEzVzPmX4uLVmMdY8e2fxyRpYmJz/ADsas+NzqNtDdPQrYW7MPU8TXto0730y9fysSr2tq5atXLntYj6eIpq5j7Jh9HjY3ttnf2w9gbf27quDr+5tc3TpeTodnTsim9d7aLvdXfp7ZmYoijnmfL1+xsjb6Y7OtaBh6FRtTRKNEwr/AMKxtNjT7Xwaxe5mfaUW+3tpq5qqnmI585+lYdj+Hjpn013Fe13a+x9E0PWLsVRVm4eJTTciKv1opn/Z558+3jy8vRFNbTrEbT/bM4/7bNLTn7WF/DXufRNndcPENoOv5mNo+5cjdM6tRGfeptVZOn12afY3KJqmOaKfnenp3faxJhdU8XaWy/E31D0LRdL3LtLV934mJpdOq2YuaZkX57LV7Jrj0rtRXVTV5esxHm3K6j9B+nnV3JxcjeWztI3Fk41PZZyM7Giq5RT69vfHE8c8zxzx5yvtHT3bFvZs7So2/plG15sTjTo9OLRGLNufWn2fHHHPn/Hz9Wxr6cTzTE5nGfwx5fgclsYz3tE/E9lbj0PTOmUb2606Nue/k7r0nKsbe0TTsfExKLVF+mqvImuKqq5t26fSqqYjz+7L259+bo3v4mt67T2juHafTaNA0zCuZu4c/TLWXqmq0XaPa0xbmuqmn2NuJiPOZ4mft8sq4fhN6O6foOo6Nj9ONvW9O1Hs+FWow4mbvZPNMTVPzoiJ84iJhcd3+G/pfv6rTKtw7F0TV69Nx6MPFrycWJqt2KI4ot8+s0xEcRE8x6/SqdfSmIjHTPZHbjs6fzLOS38mf1aYdP8AW8TUul/jKpo3hTvXIqsXK51qum3brzopw66KrtNFHzYtxVE0xNPlxTDcHpNv3bu3enHSTQdT1nDwdZ1rQcKnTsG/c7buXNGNbmuKI9/ET5r3hdCOnenazqWq4uytEsZmpYEaVmVW8KiKMjEiKY9hXRx2TRxTTHHHpTC/3Ni7bu5ei5Ve39LrytEo9npd6rDtzXgU8RT22J45txxERxTx5RDnq61NTsn+Rj9lUpNf59rW7wmbp0PZm7euWg7j1DE0fddneWZqeZ+kL9Nmu7h3KaZsXomuY7rcUeXPpH+fnjPeG/NhavmdD+oG3tvTtfphg9QtQpzcm/j02sa7lV09lvP+bMxFuq5TVMVzx6T5Q246h+H7px1Y1LG1Dd+y9G3Bn49Ps7eVm40VXYp91M1RxMxHuieeOZekzNibb1DaU7WydB02/tqbEY36IrxaJxYtR6URb47YiPdxHkr19Itz4nM9fyxt+3czknHK1v8AEruXR95dcvD1oW3s7G1bc2NuadWrjAvU3asbT6LFXtq65pme2ir5vr69v2Lx4ULdEdRfEfcimmLk78vUzVEecxGLamImfs5n75ZZ6c9B+nvSPIysjZuztI27k5VPZev4WNFNyun/AAzVPM8fZzx5PVaVtrSNCyNRv6bpWFp9/UsicrOu4uPRbqyr0xFM3Ls0xHfXxER3TzPEQ521q8nq69MfvlUVnm5paXdJMezb/ssdcqot0Uzd0DXa7kxH61XwjIjmfp8oiP8AJtZ0N8+iuwP/ABfwP/Z6F8xNj7cwNrV7ZxtA0zH25XbuWatItYdunEqormZrpm1EdvFU1VTMcefM8+q6YODjaZhY+Hh49rExMe3Tas2LFEUW7dFMcU000x5RERERER6J1dWNTO3WZn8yteXH3YVwHmdQAAAAE9ujnzn0YRujbo98qgJdIjAANAAAAAAElynujn3wnA6vnE9ynieY9EinLoANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGmmap8k1Nr3z9yp6MyqIQpoin+KYErAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEOIn3IgIcR9EHEfRCICHHCIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkuRzT/BSfQoVR21TDYRaEPP6avvk9/wBoKSAAAAAAAAAAAAAAAAAAAAAAAAAAAnot8+c+jCIyUUc+c+iqCXSIwADQAAAAAAAAAEJjmOFGqntnhXS1U90NhkxlRCY4niRTmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABETM+SpTb49fNjYjKSmiav4KtNEU/xTDMriMADGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACz7r3dpGyNFu6trmdb03TbVVNNzJuxPZRNU8RzxE8czMR/mvD4db0XC3HpGZpepY1GZgZlqqxfsXI5proqjiYldOTmjn6duOuHPU5+SfV45uzPTP2sd/Kh6V/tvpf89X5T5UPSv9t9L/AJ6vyufHX7o1m9E9+5GkXJrv6Vf5v6bl1f8AdbPPpM/46Z+bV/lPpMMa8v1HQ/pXgOJ0q62lq2mtt46eT8d4n+tPSXCa1tDW0axas4nr5uqPyoelf7b6X/PV+U+VD0r/AG30v+er8rldycu/wdwn1LeHk83x5x30qePm6o/Kh6V/tvpf89X5T5UPSv8AbfS/56vyuV3JyfB3CfUt4eR8ecd9Knj5uqPyoelf7b6X/PV+U+VD0r/bfS/56vyuV3JyfB3CfUt4eR8ecd9Knj5uqPyoelf7b6X/AD1flPlQ9K/230v+er8rldycnwdwn1LeHkfHnHfSp4+bqj8qHpX+2+l/z1flPlQ9K/230v8Anq/K5XcnJ8HcJ9S3h5Hx5x30qePm6o/Kh6V/tvpf89X5T5UPSv8AbfS/56vyuV3JyfB3CfUt4eR8ecd9Knj5uqPyoelf7b6X/PV+U+VD0r/bfS/56vyuV3JyfB3CfUt4eR8ecd9Knj5uqPyoelf7b6X/AD1flPlQ9K/230v+er8rldycnwdwn1LeHkfHnHfSp4+bqj8qHpX+2+l/z1flPlQ9K/230v8Anq/K5XcnJ8HcJ9S3h5Hx5x30qePm6o/Kh6V/tvpf89X5T5UPSv8AbfS/56vyuV3JyfB3CfUt4eR8ecd9Knj5uqPyoelf7b6X/PV+U+VD0r/bfS/56vyuV3JyfB3CfUt4eR8ecd9Knj5uqPyoelf7b6X/AD1flPlQ9K/230v+er8rldycnwdwn1LeHkfHnHfSp4+bqj8qHpX+2+l/z1flPlQ9K/230v8Anq/K5XcnJ8HcJ9S3h5Hx5x30qePm6o/Kh6V/tvpf89X5T5UPSv8AbfS/56vyuV3JyfB3CfUt4eR8ecd9Knj5uqPyoelf7b6X/PV+U+VD0r/bfS/56vyuV3JyfB3CfUt4eR8ecd9Knj5uqPyoelf7b6X/AD1flPlQ9K/230v+er8rldycnwdwn1LeHkfHnHfSp4+bqj8qHpX+2+l/z1flPlQ9K/230v8Anq/K5XcnJ8HcJ9S3h5Hx5x30qePm6o/Kh6V/tvpf89X5T5UPSv8AbfS/56vyuV3JyfB3CfUt4eR8ecd9Knj5uqPyoelf7b6X/PV+U+VD0r/bfS/56vyuV3JyfB3CfUt4eR8ecd9Knj5uqPyoelf7b6X/AD1flPlQ9K/230v+er8rldycnwdwn1LeHkfHnHfSp4+bqj8qHpX+2+l/z1flPlQ9K/230v8Anq/K5XcnJ8HcJ9S3h5Hx5x30qePm6o/Kh6V/tvpf89X5T5UPSv8AbfS/56vyuV3JyfB3CfUt4eR8ecd9Knj5uqPyoelf7b6X/PV+VJX4nuldXHG99L/nq/K5Y8nJ8H8J9S3h5Hx3xv0qePm6l/Kc6WftvpX89f5T5TnSz9t9K/nr/K5acnLfg/hPqW8PJPx1xv0qePm6l/Kc6WftvpX89f5T5TnSz9t9K/nr/K5acnJ8H8J9S3h5Hx1xv0qePm6l/Kc6WftvpX89f5T5TnSz9t9K/nr/ACuWnJyfB/CfUt4eR8dcb9Knj5upfynOln7b6V/PX+U+U50s/bfSv56/yuWnJyfB/CfUt4eR8dcb9Knj5upfynOln7b6V/PX+U+U50s/bfSv56/yuWnJyfB/CfUt4eR8dcb9Knj5upfynOln7b6V/PX+U+U50s/bfSv56/yuWnJyfB/CfUt4eR8dcb9Knj5upfynOln7b6V/PX+U+U50s/bfSv56/wArlpycnwfwn1LeHkfHXG/Sp4+bqX8pzpZ+2+lfz1/lPlOdLP230r+ev8rlpycnwfwn1LeHkfHXG/Sp4+bqX8pzpZ+2+lfz1/lPlOdLP230r+ev8rlpycnwfwn1LeHkfHXG/Sp4+bqX8pzpZ+2+lfz1/lPlOdLP230r+ev8rlpycnwfwn1LeHkfHXG/Sp4+bqX8pzpZ+2+lfz1/lPlOdLP230r+ev8AK5acnJ8H8J9S3h5Hx1xv0qePm6l/Kc6WftvpX89f5T5TnSz9t9K/nr/K5acnJ8H8J9S3h5Hx1xv0qePm6l/Kc6WftvpX89f5T5TnSz9t9K/nr/K5acnJ8H8J9S3h5Hx1xv0qePm6l/Kc6WftvpX89f5T5TnSz9t9K/nr/K5acnJ8H8J9S3h5Hx1xv0qePm6m0+J3pXE8zvfS/wCer8qp8qHpX+2+l/z1flcruTlnwfwn1LeHkqP6742P/ap4+bqj8qHpX+2+l/z1flPlQ9K/230v+er8rldycnwdwn1LeHkfHnHfSp4+bqj8qHpX+2+l/wA9X5T5UPSv9t9L/nq/K5XcnJ8HcJ9S3h5Hx5x30qePm6o/Kh6V/tvpf89X5T5UPSv9t9L/AJ6vyuV3JyfB3CfUt4eR8ecd9Knj5uqPyoelf7b6X/PV+U+VD0r/AG30v+er8rldycnwdwn1LeHkfHnHfSp4+bq/o3iE6dbhyqsbTt26fl36aJuTRbqq5imJiJn0+mY+8c7fD9P/AMNcv/m+5/0lofz/ABvoDh+G1fV1vM/l5P6bgP6n4ni9CNW1KxP4+bqsA/hH6SAAAAlro7o+1R9H0JK6O7+LYlMwpB6CkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJqbcz6+TBKnptc+qpTTFPoizK4qhERHoiDFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMa9fejWD1r2Fk6Re7LGp2eb+nZlUf6m9EeXP+7V+rVH0Tz6xDlprmiZ229YzdK1PGrw9Qw7tVi/YuRxVRXTPEx//wB9/q7KtTfG30A+M2k17+0LGmrVsC1EalYtU+eRj0+lzj31UR6/TT/3sP7v+mfS/sup7HrT/Zadvsnyn9fxfm/9X+gvbNL27h4/1KRvHfXzj9PwaHAP11+GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMm+H3/ALNcv/m+5/0loPD7/wBmuX/zfc/6S0P4r0r/ALmfuh+g+hv9pH3y6BfKp6O/vN2r/VbP5j5VPR395u1f6rZ/M4RcHD+E90afzS/ZPbLdzu78qno7+83av9Vs/mPlU9Hf3m7V/qtn8zhFwcHujT+aT2y3c7u/Kp6O/vN2r/VbP5j5VPR395u1f6rZ/M4RcHB7o0/mk9st3O7vyqejv7zdq/1Wz+Y+VT0d/ebtX+q2fzOEXBwe6NP5pPbLdzu3X4pujtX/AM5u1ef+dbP5lP5U3R79521f6ra/Fwo4OG+6dP5pZ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8T5U3R79521f6ra/Fwo4OD3Tp/NJ7Xbud1/lTdHv3nbV/qtr8UY8UnR6f8A5ztq/wBVs/mcJ+Dg906fzSe127ndunxTdHKf/nN2r/VbP5k3yqejv7zdq/1Wz+Zwi4OGe6dP5pb7Zbud3flU9Hf3m7V/qtn8x8qno7+83av9Vs/mcIuDg90afzSe2W7nd35VPR395u1f6rZ/MfKp6O/vN2r/AFWz+Zwi4OD3Rp/NJ7Zbud3flU9Hf3m7V/qtn8x8qno7+83av9Vs/mcIuDg90afzSe2W7nd35VPR395u1f6rZ/MfKp6O/vN2r/VbP5nCLg4PdGn80ntlu53d+VT0d/ebtX+q2fzHyqejv7zdq/1Wz+Zwi4OD3Rp/NJ7Zbud3flU9Hf3m7V/qtn8x8qno7+83av8AVbP5nCLg4PdGn80ntlu53d+VT0d/ebtX+q2fzHyqejv7zdq/1Wz+Zwi4OD3Rp/NJ7Zbud3flU9Hf3m7V/qtn8x8qno7+83av9Vs/mcIuDg90afzSe2W7nd35VPR395u1f6rZ/MfKp6O/vN2r/VbP5nCLg4PdGn80ntlu53d+VT0d/ebtX+q2fzHyqejv7zdq/wBVs/mcIuDg90afzSe2W7nd35VPR395u1f6rZ/MfKp6O/vN2r/VbP5nCLg4PdGn80ntlu53d+VT0d/ebtX+q2fzHyqejv7zdq/1Wz+Zwi4OD3Rp/NJ7Zbud3flU9Hf3m7V/qtn8x8qno7+83av9Vs/mcIuDg90afzSe2W7nd35VPR395u1f6rZ/MfKp6O/vN2r/AFWz+Zwi4OD3Rp/NJ7Zbud3flU9Hf3m7V/qtn8x8qno7+83av9Vs/mcIuDg90afzSe2W7nd35VPR395u1f6rZ/MfKp6O/vN2r/VbP5nCLg4PdGn80ntlu53d+VT0d/ebtX+q2fzHyqejv7zdq/1Wz+Zwi4OD3Rp/NJ7Zbud3flU9Hf3m7V/qtn8x8qno7+83av8AVbP5nCLg4PdGn80ntlu53d+VT0d/ebtX+q2fzHyqejv7zdq/1Wz+Zwi4OD3Rp/NJ7Zbud3flU9Hf3m7V/qtn8x8qno7+83av9Vs/mcIuDg90afzSe2W7nd35VPR395u1f6rZ/MfKp6O/vN2r/VbP5nCLg4PdGn80ntlu53d+VT0d/ebtX+q2fzHyqejv7zdq/wBVs/mcIuDg90afzSe2W7nd35VPR395u1f6rZ/MfKp6O/vN2r/VbP5nCLg4PdGn80ntlu53d+VT0d/ebtX+q2fzHyqejv7zdq/1Wz+Zwi4OD3Rp/NJ7Zbud3flU9Hf3m7V/qtn8x8qno7+83av9Vs/mcIuDg90afzSe2W7nd35VPR395u1f6rZ/MfKp6O/vN2r/AFWz+Zwi4OD3Rp/NJ7Zbud3flU9Hf3m7V/qtn8x8qno7+83av9Vs/mcIuDg90afzSe2W7nd35VPR395u1f6rZ/MfKp6O/vN2r/VbP5nCLg4PdGn80ntlu53d+VT0d/ebtX+q2fzJa/FN0buUVUVdTNqVU1RxMTqtmYmP5nCTg4PdOn80ntlu5uf4jsfp5tffd3L2XvDQtX29qU1X7VjAzrd2cOvn59qYpnyp5nmmfonj/ZYp+NejfWmJ/wAWGBuEX9xw/pbX0dKunbFpjbM9Z+9+dcV/SnCcRrW1aWmsTOcRjEfczx8a9G+tMT/iwfGvRvrTE/4sMDj0e+9X5I8Xl+D+G+rbwZ4+NejfWmJ/xYPjXo31pif8WGBw996vyR4nwfw31beDPHxr0b60xP8AiwfGvRvrTE/4sMDh771fkjxPg/hvq28GePjXo31pif8AFg+NejfWmJ/xYYHD33q/JHifB/DfVt4M8fGvRvrTE/4sHxr0b60xP+LDA4e+9X5I8T4P4b6tvBnj416N9aYn/Fg+NejfWmJ/xYYHD33q/JHifB/DfVt4M8fGvRvrTE/4sHxr0b60xP8AiwwOHvvV+SPE+D+G+rbwZ4+NejfWmJ/xYPjXo31pif8AFhgcPfer8keJ8H8N9W3gzx8a9G+tMT/iwfGvRvrTE/4sMDh771fkjxPg/hvq28GxGNlWcyxResXaL1quOaa6J5iVViDp/u/9BZfwPKr4wL9XrPpar/xfwn3/AHsvxPMcx5w/oeD4uvF6fNG0x1h/B+lvRmp6L1/VW3rPSe+POO0Ae98UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABk3w+/wDZrl/833P+ktB4ff8As1y/+b7n/SWh/Felf9zP3Q/QfQ3+0j75aSgPgv1UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZN6b7v8AhNFGkZlfN6iP+T3Kp/Wpj/Yn7Y932fwYyTW7ldm5Tct1TRXTMVU1UzxMTHpL2cLxN+F1I1K/j9sPlek/R+n6S4edHU69k90/zq2LHnNk7rp3Lp/F2Ypz7MRF6mPLu+iuPsn/AM0vRv0LS1aa1I1KTtL8I4nhtThNa2hrRi0ADq8oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADJvh9/7Ncv/AJvuf9JaDw+/9muX/wA33P8ApLQ/ivSv+5n7ofoPob/aR98tJQHwX6qAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAu+0sq7ibk06qzcm3VVept1ce+mZ4mJZ2B/X+hJn1d4+1+U/1hERxOlON+X9wB/SPz8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABk3w+/8AZrl/833P+ktAP4r0r/uZ+6H6D6G/2kffL//Z";
const BOA_LETTERHEAD_URL = `data:image/jpeg;base64,${BOA_LETTERHEAD_B64}`;

// BOA brand colors (extracted from the actual document)
const BOA = {
  primaryBlue: "#1E3A6B", // dark navy blue used in headings & table headers
  primaryBlueLight: "#2563A8", // lighter blue for accents
  textBlack: "#1a1a1a",
  textGray: "#5a5a5a",
  tableHeaderBg: "#1E3A6B",
  tableHeaderText: "#FFFFFF",
  tableRowBorder: "#D1D5DB",
  rowAltBg: "#F9FAFB",
  green: "#16A34A",
};

const PRODUCT_DATA = {
  FPM: {
    code: "FPM",
    fullName: "Fixed Private Mandate",
    longName: "BOA Alphaline — Fixed Private Mandate",
    tagline:
      "A defensive, fixed-income mandate designed for predictable cash flow and capital preservation. Ideal as the income-anchor allocation of a balanced portfolio.",
    type: "Fixed Income Strategy",
    strategy: "Cross Exchange Arbitrage",
    minAmount: "USD 100,000 (minimum)",
    tenure: "1 + 1 Year",
    payout: "Semi-Annually",
    subscriptionFee: "2% (one-time)",
    managementFee: "2%",
    performanceFee: "NIL",
    riskProfile: "Lower",
    benefits: [
      {
        title: "Capital Protection",
        desc: "structured to preserve principal investment throughout the mandate term.",
      },
      {
        title: "Consistent Income",
        desc: "predictable semi-annual cash flow with fixed return parameters.",
      },
      {
        title: "Advanced Strategy",
        desc: "cross-exchange arbitrage and hedging techniques deployed by experienced managers.",
      },
      {
        title: "Risk Control",
        desc: "diversified holdings with active risk monitoring and professional oversight.",
      },
    ],
    clientValue: [
      "Reliable passive income stream",
      "Reduced exposure to market volatility",
      "Beneficiary nomination available",
      "Protection against legal and asset-related risks",
    ],
  },
  TPM: {
    code: "TPM",
    fullName: "Treasury Private Mandate",
    longName: "BOA Alphaline — Treasury Private Mandate",
    tagline:
      "An actively managed profit-sharing mandate built for capital growth and flexibility. No lock-in, quarterly payouts, and a track record of 49 consecutive positive months since inception — with 70% of net profits going directly to the investor.",
    type: "Profit Sharing Strategy",
    strategy: "Cross Exchange Arbitrage",
    minAmount: "USD 100,000 (minimum)",
    tenure: "No Lock-in (open-ended)",
    payout: "Quarterly",
    subscriptionFee: "2% (one-time)",
    managementFee: "2% per annum",
    performanceFee: "70% to Investor / 30% to Manager (on net profits)",
    riskProfile: "Moderate",
    benefits: [
      {
        title: "Flexible Liquidity",
        desc: "no lock-in period — investors retain the ability to adjust or exit at any time.",
      },
      {
        title: "Investor-Favourable Profit Split",
        desc: "70% of net profits flow directly to the investor; the manager retains only 30%, ensuring incentives are firmly aligned with client outcomes.",
      },
      {
        title: "Dynamic Strategy Execution",
        desc: "cross-exchange arbitrage with active market positioning across multiple venues.",
      },
      {
        title: "Adaptive Risk Management",
        desc: "portfolio is repositioned in response to changing market conditions, with disciplined drawdown controls.",
      },
    ],
    clientValue: [
      "Full flexibility without capital lock-in commitment",
      "Investor takes the majority share (70%) of all upside generated",
      "Potential for enhanced returns during strong market opportunities",
      "Beneficiary nomination available",
      "Protection against legal and asset-related risks",
    ],
  },
  IGPM: {
    code: "IGPM",
    fullName: "Income Growth Private Mandate",
    longName: "BOA Alphaline — Income Growth Private Mandate",
    tagline:
      "A hybrid mandate combining a fixed-income foundation with capital growth participation. Designed for investors seeking both predictable returns and exposure to upside — with a controlled downside profile.",
    type: "Hybrid Fixed Income + Growth Strategy",
    strategy: "Cross Exchange Arbitrage & Multi-Strategy Model",
    minAmount: "USD 100,000 (minimum)",
    tenure: "2-Year Cycles",
    payout: "Fixed 6% p.a. + Capital Growth at Cycle End",
    subscriptionFee: "2% (one-time)",
    managementFee: "2% per annum",
    performanceFee: "NIL",
    riskProfile: "Moderate (max ~25% drawdown)",
    benefits: [
      {
        title: "Dual-Engine Returns",
        desc: "structured to deliver both consistent income and meaningful capital appreciation within a single mandate.",
      },
      {
        title: "Fixed Income Floor",
        desc: "6% per annum fixed dividend regardless of growth performance, providing stability across market conditions.",
      },
      {
        title: "Growth Participation",
        desc: "capital growth potential of 10–20% per cycle through actively managed strategies.",
      },
      {
        title: "Defined Risk Ceiling",
        desc: "maximum drawdown contained to approximately 25%, providing predictable downside boundaries.",
      },
    ],
    clientValue: [
      "Income stability with growth participation in one product",
      "Lower drawdown profile than pure equity exposure",
      "Cycle-based structure for disciplined re-evaluation",
      "Beneficiary nomination available",
      "Protection against legal and asset-related risks",
    ],
  },
};

const PRODUCT_COMBOS = [
  { id: "FPM", label: "FPM only", products: ["FPM"] },
  { id: "TPM", label: "TPM only", products: ["TPM"] },
  { id: "IGPM", label: "IGPM only", products: ["IGPM"] },
  { id: "FPM+TPM", label: "FPM + TPM", products: ["FPM", "TPM"] },
  { id: "FPM+IGPM", label: "FPM + IGPM", products: ["FPM", "IGPM"] },
  { id: "TPM+IGPM", label: "TPM + IGPM", products: ["TPM", "IGPM"] },
];

function formatUSD(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}
function formatDateLong(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ProposalBuilder({ onBack }) {
  const [view, setView] = useState("form");
  const [clientName, setClientName] = useState("");
  const [proposalDate, setProposalDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [amount, setAmount] = useState(100000);
  const [comboId, setComboId] = useState("FPM");
  const [profitShareInvestor, setProfitShareInvestor] = useState(70); // 70 or 50

  const combo =
    PRODUCT_COMBOS.find((c) => c.id === comboId) || PRODUCT_COMBOS[0];
  const products = combo.products.map((code) => PRODUCT_DATA[code]);
  const isCombined = products.length > 1;
  const includesTPM = combo.products.includes("TPM");
  const profitShareManager = 100 - profitShareInvestor;

  function handleGenerate() {
    if (!clientName || !amount || amount < 100000) return;
    setView("proposal");
  }

  // ====================================================================
  // FORM VIEW (Provestor branded)
  // ====================================================================
  if (view === "form") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: T.pageBg,
          color: T.textPrimary,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <main
          style={{ margin: "0 auto", maxWidth: 1152, padding: "32px 24px" }}
        >
          <button
            onClick={onBack}
            style={{
              marginBottom: 24,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 700,
              color: T.gold,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontFamily: "inherit",
              letterSpacing: "0.05em",
            }}
          >
            <span>←</span> Back to Dashboard
          </button>

          <div
            style={{
              marginBottom: 28,
              borderBottom: `1px solid ${T.border}`,
              paddingBottom: 24,
            }}
          >
            <div style={S.goldRule}>
              <span style={S.goldRuleLine} />
              <p style={S.eyebrow}>Closing Tool</p>
            </div>
            <h1 style={{ ...S.h1, marginTop: 14 }}>📄 Create Proposal</h1>
            <p style={{ ...S.bodyMuted, maxWidth: 720 }}>
              Generate a BOA Alphaline-branded proposal for your client. Just
              enter the details, pick the products, and the proposal is ready to
              print or save as PDF.
            </p>
          </div>

          <div
            style={{ display: "grid", gap: 24, gridTemplateColumns: "1fr 1fr" }}
          >
            <div style={S.cardPad}>
              <SectionTitle>👤 Client Details</SectionTitle>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  marginTop: 8,
                }}
              >
                <label>
                  <span style={S.label}>Client Name *</span>
                  <input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Mr. Tan Wei Ming"
                    style={S.input}
                  />
                </label>
                <label>
                  <span style={S.label}>Proposal Date *</span>
                  <input
                    type="date"
                    value={proposalDate}
                    onChange={(e) => setProposalDate(e.target.value)}
                    style={S.input}
                  />
                </label>
                <label>
                  <span style={S.label}>Investment Amount (USD) *</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min="100000"
                    step="10000"
                    placeholder="100000"
                    style={S.input}
                  />
                  <p style={S.helper}>Minimum USD 100,000 per mandate.</p>
                </label>
              </div>
            </div>

            <div style={S.cardPad}>
              <SectionTitle>📦 Select Products</SectionTitle>
              <p style={{ ...S.helper, marginBottom: 16 }}>
                Choose the mandate(s) to include in this proposal. Combined
                options will include the side-by-side comparison and allocation
                framework.
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {PRODUCT_COMBOS.map((c) => {
                  const isSelected = comboId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setComboId(c.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 18px",
                        border: `2px solid ${isSelected ? T.gold : T.border}`,
                        background: isSelected ? "#fffbeb" : "white",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        textAlign: "left",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 999,
                          border: `2px solid ${isSelected ? T.gold : T.border}`,
                          background: isSelected ? T.gold : "transparent",
                          flexShrink: 0,
                          position: "relative",
                        }}
                      >
                        {isSelected && (
                          <div
                            style={{
                              position: "absolute",
                              inset: 3,
                              borderRadius: 999,
                              background: "white",
                            }}
                          />
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: isSelected ? T.navyText : T.textPrimary,
                        }}
                      >
                        {c.label}
                      </span>
                      {c.products.length > 1 && (
                        <span
                          style={{
                            marginLeft: "auto",
                            fontSize: 10,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.15em",
                            color: T.gold,
                          }}
                        >
                          Combined
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TPM-specific: Profit Sharing selector (only shown when combo includes TPM) */}
          {includesTPM && (
            <div
              style={{
                ...S.cardPad,
                marginTop: 24,
                background: "#fffbeb",
                border: `1px solid ${T.gold}`,
              }}
            >
              <SectionTitle>💼 TPM Profit Sharing Split</SectionTitle>
              <p style={{ ...S.helper, marginBottom: 16 }}>
                This combo includes TPM. Choose the profit-sharing structure for
                this client. The selected ratio will flow through the entire
                proposal — performance fee, marketing copy, and YTD net return
                calculations.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {[
                  {
                    value: 70,
                    label: "70 / 30",
                    subtitle: "Investor / Manager",
                    note: "Standard",
                  },
                  {
                    value: 50,
                    label: "50 / 50",
                    subtitle: "Investor / Manager",
                    note: "Alternative",
                  },
                ].map((option) => {
                  const isSelected = profitShareInvestor === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setProfitShareInvestor(option.value)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 6,
                        padding: "16px 20px",
                        border: `2px solid ${isSelected ? T.gold : T.border}`,
                        background: isSelected
                          ? "white"
                          : "rgba(255,255,255,0.6)",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        textAlign: "left",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 999,
                            border: `2px solid ${
                              isSelected ? T.gold : T.border
                            }`,
                            background: isSelected ? T.gold : "transparent",
                            flexShrink: 0,
                            position: "relative",
                          }}
                        >
                          {isSelected && (
                            <div
                              style={{
                                position: "absolute",
                                inset: 3,
                                borderRadius: 999,
                                background: "white",
                              }}
                            />
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: isSelected ? T.navyText : T.textPrimary,
                          }}
                        >
                          {option.label}
                        </span>
                        <span
                          style={{
                            marginLeft: "auto",
                            fontSize: 10,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.15em",
                            color: T.gold,
                          }}
                        >
                          {option.note}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          color: T.textMuted,
                          marginLeft: 28,
                        }}
                      >
                        {option.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div
            style={{ marginTop: 32, display: "flex", justifyContent: "center" }}
          >
            <button
              onClick={handleGenerate}
              disabled={!clientName || !amount || amount < 100000}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background:
                  !clientName || !amount || amount < 100000
                    ? T.textMuted
                    : T.navyBg,
                color: T.goldOnNavy,
                padding: "18px 40px",
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                border: "none",
                borderTop: `2px solid ${T.gold}`,
                cursor:
                  !clientName || !amount || amount < 100000
                    ? "not-allowed"
                    : "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s ease",
              }}
            >
              Generate Proposal <span>→</span>
            </button>
          </div>

          {(!clientName || !amount || amount < 100000) && (
            <p
              style={{
                marginTop: 16,
                textAlign: "center",
                fontSize: 13,
                color: T.textMuted,
              }}
            >
              {!clientName ? "Enter a client name " : ""}
              {!amount || amount < 100000
                ? "Amount must be at least USD 100,000"
                : ""}
            </p>
          )}
        </main>
      </div>
    );
  }

  // ====================================================================
  // PROPOSAL VIEW (BOA Alphaline branded)
  // ====================================================================
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#9CA3AF",
        fontFamily: "Calibri, 'Segoe UI', Tahoma, Arial, sans-serif",
      }}
    >
      {/* Provestor toolbar */}
      <div
        className="no-print"
        style={{
          background: T.navyBg,
          color: "white",
          padding: "16px 24px",
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderBottom: `2px solid ${T.gold}`,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setView("form")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 700,
              color: T.goldOnNavy,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              letterSpacing: "0.05em",
            }}
          >
            <span>←</span> Edit Proposal
          </button>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: T.textMutedOnNavy,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            BOA Alphaline Proposal Preview
          </p>
          <button
            onClick={() => {
              const proposalEl = document.getElementById("boa-proposal-doc");
              if (!proposalEl) return;
              const html = proposalEl.outerHTML;
              const fileName = `BOA_Proposal_${clientName.replace(
                /[^a-z0-9]/gi,
                "_"
              )}_${proposalDate}`;
              const printableHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${fileName}</title>
<style>
  @page { size: A4; margin: 0; }
  body { margin: 0; background: #9CA3AF; font-family: Calibri, 'Segoe UI', Tahoma, Arial, sans-serif; }
  .toolbar { position: sticky; top: 0; background: ${T.navyBg}; color: white; padding: 14px 24px; z-index: 100; border-bottom: 2px solid ${T.gold}; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  .toolbar button { background: ${T.gold}; color: ${T.navyBg}; border: none; padding: 10px 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em; cursor: pointer; font-family: inherit; }
  .toolbar p { margin: 0; font-size: 12px; color: ${T.textMutedOnNavy}; text-transform: uppercase; letter-spacing: 0.1em; }
  .boa-page { width: 210mm; min-height: 297mm; margin: 16px auto; background-image: url("${BOA_LETTERHEAD_URL}"); background-size: 210mm 297mm; background-repeat: no-repeat; background-color: white; box-shadow: 0 8px 24px rgba(0,0,0,0.15); position: relative; }
  .boa-content { padding: 36mm 18mm 24mm 18mm; }
  @media print {
    body { background: white !important; }
    .toolbar { display: none !important; }
    .boa-page { margin: 0 !important; box-shadow: none !important; page-break-after: always; }
    .boa-page:last-child { page-break-after: auto; }
  }
</style>
</head>
<body>
  <div class="toolbar">
    <p>BOA Alphaline · Proposal · ${clientName}</p>
    <button onclick="window.print()">🖨 Print / Save as PDF</button>
  </div>
  ${html}
</body>
</html>`;
              const newTab = window.open("", "_blank");
              if (newTab) {
                newTab.document.open();
                newTab.document.write(printableHTML);
                newTab.document.close();
                newTab.document.title = fileName;
              } else {
                alert(
                  "Please allow pop-ups for this site to open the proposal in a new tab."
                );
              }
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: T.gold,
              color: T.navyBg,
              padding: "10px 20px",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ↗ Open in New Tab
          </button>
        </div>
      </div>

      {/* The actual proposal */}
      <div id="boa-proposal-doc">
        <BOAProposalDocument
          clientName={clientName}
          proposalDate={proposalDate}
          amount={amount}
          products={products}
          isCombined={isCombined}
          profitShareInvestor={profitShareInvestor}
          profitShareManager={profitShareManager}
        />
      </div>

      <div className="no-print" style={{ height: 40 }} />
    </div>
  );
}

// ============================================================================
// BOA PROPOSAL DOCUMENT — split into A4 pages with letterhead background
// ============================================================================
function BOAProposalDocument({
  clientName,
  proposalDate,
  amount,
  products,
  isCombined,
  profitShareInvestor = 70,
  profitShareManager = 30,
}) {
  const productCodes = products.map((p) => p.code).join(" & ");
  const referenceCode = `BOA-${products.map((p) => p.code).join("-")}-${
    new Date(proposalDate).getFullYear() || 2026
  }`;

  // Shared styles for content inside BOA pages
  const ST = {
    section: {
      marginBottom: 16,
    },
    sectionHeading: {
      color: BOA.primaryBlue,
      fontSize: 15,
      fontWeight: 700,
      paddingBottom: 6,
      marginBottom: 12,
      marginTop: 18,
      borderBottom: `1px solid #B0B7C3`,
    },
    coverEyebrow: {
      fontSize: 16,
      fontWeight: 700,
      color: BOA.textBlack,
      letterSpacing: "0.02em",
      textAlign: "center",
      margin: 0,
    },
    coverSub: {
      fontSize: 13,
      fontStyle: "italic",
      color: BOA.primaryBlue,
      textAlign: "center",
      margin: "6px 0 14px",
    },
    coverDivider: {
      borderTop: `1px solid ${BOA.primaryBlue}`,
      margin: "10px 0 16px",
    },
    productLine: {
      fontSize: 13,
      fontWeight: 700,
      color: BOA.textBlack,
      textAlign: "center",
      margin: "6px 0",
    },
    ampersand: {
      fontSize: 13,
      color: BOA.textGray,
      textAlign: "center",
      margin: "2px 0",
    },
    p: {
      fontSize: 11,
      lineHeight: 1.55,
      color: BOA.textBlack,
      margin: "0 0 8px",
      textAlign: "justify",
    },
    pBold: {
      fontSize: 11,
      lineHeight: 1.55,
      color: BOA.textBlack,
      margin: "0 0 8px",
      fontWeight: 700,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      margin: "8px 0 12px",
      fontSize: 10.5,
    },
    th: {
      background: BOA.tableHeaderBg,
      color: BOA.tableHeaderText,
      padding: "8px 12px",
      textAlign: "left",
      fontWeight: 700,
      fontSize: 10.5,
      border: "none",
    },
    td: {
      padding: "7px 12px",
      borderBottom: `1px solid ${BOA.tableRowBorder}`,
      fontSize: 10.5,
      color: BOA.textBlack,
      verticalAlign: "top",
    },
    tdLabel: {
      padding: "7px 12px",
      borderBottom: `1px solid ${BOA.tableRowBorder}`,
      fontSize: 10.5,
      color: BOA.textBlack,
      fontWeight: 700,
      width: "32%",
      verticalAlign: "top",
    },
    bullet: {
      fontSize: 11,
      lineHeight: 1.55,
      color: BOA.textBlack,
      margin: "0 0 6px",
      paddingLeft: 16,
      position: "relative",
      textAlign: "justify",
    },
    bulletDot: {
      position: "absolute",
      left: 0,
      top: 0,
      color: BOA.primaryBlue,
      fontWeight: 700,
      fontSize: 14,
      lineHeight: "16px",
    },
    checkBullet: {
      fontSize: 11,
      lineHeight: 1.7,
      color: BOA.textBlack,
      margin: "0 0 4px",
      paddingLeft: 22,
      position: "relative",
    },
    checkmark: {
      position: "absolute",
      left: 0,
      top: 0,
      color: BOA.green,
      fontWeight: 700,
      fontSize: 14,
    },
    note: {
      fontSize: 10,
      color: BOA.textBlack,
      fontStyle: "italic",
      margin: "4px 0 12px",
      lineHeight: 1.5,
    },
    pageBreak: {
      pageBreakBefore: "always",
    },
  };

  const pageStyle = {
    width: "210mm",
    minHeight: "297mm",
    margin: "16px auto",
    backgroundImage: `url("${BOA_LETTERHEAD_URL}")`,
    backgroundSize: "210mm 297mm",
    backgroundRepeat: "no-repeat",
    backgroundColor: "white",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    position: "relative",
  };
  const contentStyle = {
    padding: "36mm 18mm 24mm 18mm",
  };

  return (
    <>
      {/* ============= PAGE 1 — COVER & INTRO ============= */}
      <section className="boa-page" style={pageStyle}>
        <div className="boa-content" style={contentStyle}>
          {/* Title block */}
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <h1 style={ST.coverEyebrow}>INVITATION FOR ACCOUNT OPENING</h1>
            <p style={ST.coverSub}>Asset Structuring &amp; Income Strategy</p>
            <hr style={ST.coverDivider} />
            {products.map((p, i) => (
              <React.Fragment key={p.code}>
                <p style={ST.productLine}>{p.longName}</p>
                {i < products.length - 1 && <p style={ST.ampersand}>&amp;</p>}
              </React.Fragment>
            ))}
          </div>

          {/* Private & Confidential */}
          <h2 style={ST.sectionHeading}>Private &amp; Confidential</h2>

          <p style={ST.pBold}>Dear {clientName},</p>
          <p style={ST.p}>
            Thank you for taking the time to discuss your wealth objectives with
            us. Following our recent conversation, we are pleased to present
            this tailored proposal outlining a structured allocation strategy
            designed to address your priorities of risk protection, income
            stability, and wealth structuring.
          </p>
          <p style={ST.p}>
            {isCombined ? (
              <>
                This invitation introduces{" "}
                {products.length === 2 ? "two" : "three"} complementary BOA
                Alphaline mandates:{" "}
                {products.map((p, i) => (
                  <React.Fragment key={p.code}>
                    <strong>
                      the {p.fullName} ({p.code})
                    </strong>
                    {i === 0 && products.length === 2 ? "; and " : ""}
                    {i === 0 && products.length > 2 ? "; " : ""}
                    {i === products.length - 2 && products.length > 2
                      ? "; and "
                      : ""}
                  </React.Fragment>
                ))}
                . Together, they offer a balanced framework for both consistent
                income generation and dynamic capital growth.
              </>
            ) : (
              <>
                This invitation introduces the{" "}
                <strong>
                  {products[0].fullName} ({products[0].code})
                </strong>
                ,{" "}
                {products[0].code === "FPM"
                  ? "our defensive fixed-income strategy with predictable semi-annual payouts and capital protection"
                  : products[0].code === "TPM"
                  ? "our actively managed profit-sharing strategy with quarterly distributions and no lock-in"
                  : "our hybrid mandate combining a fixed-income foundation with capital growth participation"}
                .
              </>
            )}
          </p>
          <p style={ST.p}>
            We look forward to the opportunity to support you in advancing your
            wealth strategy.
          </p>

          {/* Client Overview */}
          <h2 style={ST.sectionHeading}>Client Overview</h2>
          <table style={ST.table}>
            <thead>
              <tr>
                <th style={ST.th}>Category</th>
                <th style={ST.th}>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={ST.tdLabel}>Client Name</td>
                <td style={ST.td}>{clientName}</td>
              </tr>
              <tr>
                <td style={ST.tdLabel}>Key Focus</td>
                <td style={ST.td}>
                  Risk Protection, Income Stability, Wealth Structuring
                </td>
              </tr>
              <tr>
                <td style={ST.tdLabel}>Investment Amount</td>
                <td style={ST.td}>
                  <strong>{formatUSD(amount)}</strong>
                </td>
              </tr>
              <tr>
                <td style={ST.tdLabel}>Proposal Date</td>
                <td style={ST.td}>{formatDateLong(proposalDate)}</td>
              </tr>
              <tr>
                <td style={ST.tdLabel}>Reference</td>
                <td style={ST.td}>{referenceCode}</td>
              </tr>
            </tbody>
          </table>

          {/* About BOA */}
          <h2 style={ST.sectionHeading}>About BOA Alphaline</h2>
          <p style={ST.p}>
            <strong>BOA Alphaline Investment Limited</strong> is licensed and
            regulated by the British Virgin Islands Financial Services
            Commission (<em>BVI FSC</em>) as an Approved Investment Manager,
            acting as investment advisor or investment manager to private and
            professional funds.
          </p>
          <p style={ST.p}>
            Our mandate covers closed-ended funds and structured vehicles
            incorporated as companies, partnerships, or trusts under BVI law or
            any recognised jurisdiction, providing institutional-grade oversight
            to private and professional fund structures.
          </p>

          {/* Wealth Challenges */}
          <h2 style={ST.sectionHeading}>Current Wealth Challenges</h2>
          {[
            {
              title: "Market Volatility",
              desc: "Traditional investments often lack consistency and predictability, exposing portfolios to short-term swings.",
            },
            {
              title: "Risk Exposure",
              desc: "Personal assets may face legal, financial, and structural risks without proper segregation.",
            },
            {
              title: "Income Instability",
              desc: "Generating sustainable, predictable passive income can be difficult in volatile rate environments.",
            },
            {
              title: "Succession Gaps",
              desc: "Lack of structured planning can lead to inefficiencies, delays, or disputes during wealth transfer.",
            },
          ].map((c, i) => (
            <div key={i}>
              <p style={{ ...ST.bullet, fontWeight: 700, marginBottom: 2 }}>
                <span style={ST.bulletDot}>•</span>
                {c.title}
              </p>
              <p
                style={{
                  fontSize: 11,
                  lineHeight: 1.55,
                  color: BOA.textBlack,
                  margin: "0 0 8px",
                  paddingLeft: 16,
                }}
              >
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============= PAGE 2 — Strategy Objectives ============= */}
      <section className="boa-page" style={pageStyle}>
        <div className="boa-content" style={contentStyle}>
          <h2 style={ST.sectionHeading}>Strategy Objectives</h2>
          {[
            "Preserve capital across all market conditions",
            "Diversify risk across structures, jurisdictions, and strategies",
            "Generate consistent and predictable income streams",
            "Establish proactive wealth succession planning",
          ].map((o, i) => (
            <p key={i} style={ST.checkBullet}>
              <span style={ST.checkmark}>✔</span>
              {o}
            </p>
          ))}
        </div>
      </section>

      {/* ============= SOLUTION PAGES (one per product) ============= */}
      {products.map((product, idx) => (
        <ProductSolutionPages
          key={product.code}
          product={product}
          amount={amount}
          solutionNumber={idx + 1}
          showSolutionLabel={isCombined}
          ST={ST}
          pageStyle={pageStyle}
          contentStyle={contentStyle}
          profitShareInvestor={profitShareInvestor}
          profitShareManager={profitShareManager}
        />
      ))}

      {/* ============= COMBINED PORTFOLIO SECTION ============= */}
      {isCombined && (
        <CombinedPortfolioPages
          products={products}
          ST={ST}
          pageStyle={pageStyle}
          contentStyle={contentStyle}
          profitShareInvestor={profitShareInvestor}
          profitShareManager={profitShareManager}
        />
      )}

      {/* ============= FINAL PAGE — Next Steps + Closing + Disclaimer ============= */}
      <section className="boa-page" style={pageStyle}>
        <div className="boa-content" style={contentStyle}>
          <h2 style={ST.sectionHeading}>Recommended Next Steps</h2>
          {[
            "Portfolio Structuring Session — Review your current asset allocation, objectives, and time horizon.",
            isCombined
              ? `Custom Allocation Planning — Determine the optimal ${productCodes} split based on your income needs and growth appetite.`
              : `Detailed Strategy Review — Walk through ${products[0].code} structure, payout schedule, and onboarding flow.`,
            "Implementation & Onboarding — Structured entry into the selected mandates, including KYC, documentation, and account funding.",
          ].map((s, i) => (
            <p
              key={i}
              style={{ ...ST.bullet, paddingLeft: 28, marginBottom: 8 }}
            >
              <span
                style={{
                  ...ST.bulletDot,
                  fontSize: 11,
                  fontWeight: 700,
                  color: BOA.textBlack,
                }}
              >
                {i + 1}.
              </span>
              {s}
            </p>
          ))}
          <p style={{ ...ST.p, marginTop: 14 }}>
            We recommend proceeding with{" "}
            {isCombined
              ? `a structured allocation across the ${productCodes} mandates`
              : `participation in the ${products[0].code} mandate`}{" "}
            to achieve{" "}
            {isCombined
              ? "both immediate income and long-term asset growth"
              : `your wealth objectives through ${
                  products[0].code === "FPM"
                    ? "stable, predictable income"
                    : products[0].code === "TPM"
                    ? "actively managed growth with full liquidity"
                    : "balanced income and growth in a single mandate"
                }`}
            .
          </p>

          <h2 style={ST.sectionHeading}>Closing</h2>
          <p style={ST.p}>
            Should you have any questions, require clarification on any element
            of this proposal, or wish to schedule a portfolio structuring
            session, please do not hesitate to contact us. We are committed to
            providing the dedicated, personalised service your wealth deserves.
          </p>
          <p style={ST.p}>
            We thank you for the trust you place in BOA Alphaline and look
            forward to a long-term partnership.
          </p>

          <p style={{ ...ST.p, marginTop: 18 }}>Yours sincerely,</p>
          <div
            style={{
              borderBottom: `1px solid ${BOA.textBlack}`,
              width: 220,
              marginTop: 32,
              marginBottom: 8,
            }}
          />
          <p style={{ ...ST.pBold, margin: 0 }}>Authorised Representative</p>
          <p style={{ ...ST.p, margin: 0 }}>BOA Alphaline Group Limited</p>
          <p
            style={{
              fontSize: 10,
              fontStyle: "italic",
              color: BOA.textGray,
              margin: "4px 0 0",
            }}
          >
            Email: invest@boaal.com | Web: www.boaal.com
          </p>

          <h2 style={{ ...ST.sectionHeading, marginTop: 22 }}>
            Important Disclaimer
          </h2>
          <p
            style={{
              fontSize: 9.5,
              lineHeight: 1.5,
              color: BOA.textBlack,
              fontStyle: "italic",
              textAlign: "justify",
              margin: 0,
            }}
          >
            This document is prepared for the named recipient on a private and
            confidential basis and does not constitute an offer or solicitation
            in any jurisdiction where such offer or solicitation would be
            unlawful. Investment products described herein may not be suitable
            for all investors. Projected returns and historical performance
            figures are gross of fees unless explicitly stated otherwise; net
            returns will differ. Past performance is not a reliable indicator of
            future results, and forward-looking returns are indicative only.
            Investors should review the relevant offering documents and consult
            their independent legal, tax, and financial advisors before making
            any investment decision. BOA Alphaline Investment Limited is
            licensed by the British Virgin Islands Financial Services Commission
            (Approved Investment Manager).
          </p>
        </div>
      </section>
    </>
  );
}

// ============================================================================
// PRODUCT SOLUTION PAGES
// ============================================================================
function ProductSolutionPages({
  product,
  amount,
  solutionNumber,
  showSolutionLabel,
  ST,
  pageStyle,
  contentStyle,
  profitShareInvestor = 70,
  profitShareManager = 30,
}) {
  const sectionTitle = showSolutionLabel
    ? `Solution ${solutionNumber} — BOA Alphaline: ${product.fullName} (${product.code})`
    : `${product.longName}`;

  // ALL products (FPM, TPM, IGPM) split across 2 pages to ensure content never overlaps
  // Page 1: Title + tagline + Investment Summary + Projected Returns / Track Record
  // Page 2: Strategic Benefits + Client Value
  const splitsAcrossTwoPages = true;

  // For TPM, dynamically rewrite benefits + client value based on selected profit share
  const displayBenefits =
    product.code === "TPM"
      ? product.benefits.map((b) =>
          b.title === "Investor-Favourable Profit Split"
            ? {
                ...b,
                desc: `${profitShareInvestor}% of net profits flow directly to the investor; the manager retains only ${profitShareManager}%, ensuring incentives are firmly aligned with client outcomes.`,
              }
            : b
        )
      : product.benefits;
  const displayClientValue =
    product.code === "TPM"
      ? product.clientValue.map((v) =>
          v.includes("majority share (70%)")
            ? `Investor takes the majority share (${profitShareInvestor}%) of all upside generated`
            : v
        )
      : product.clientValue;

  return (
    <>
      <section className="boa-page" style={pageStyle}>
        <div className="boa-content" style={contentStyle}>
          <h2 style={ST.sectionHeading}>{sectionTitle}</h2>
          <p style={{ ...ST.p, fontStyle: "italic", color: BOA.textGray }}>
            {product.code === "TPM"
              ? `An actively managed profit-sharing mandate built for capital growth and flexibility. No lock-in, quarterly payouts, and a track record of 50 consecutive positive months since inception — with ${profitShareInvestor}% of net profits going directly to the investor.`
              : product.tagline}
          </p>

          <h2 style={ST.sectionHeading}>Investment Summary</h2>
          <table style={ST.table}>
            <thead>
              <tr>
                <th style={ST.th}>Item</th>
                <th style={ST.th}>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={ST.tdLabel}>Product Name</td>
                <td style={ST.td}>
                  {product.fullName} ({product.code})
                </td>
              </tr>
              <tr>
                <td style={ST.tdLabel}>Investment Type</td>
                <td style={ST.td}>{product.type}</td>
              </tr>
              <tr>
                <td style={ST.tdLabel}>Investment Strategy</td>
                <td style={ST.td}>{product.strategy}</td>
              </tr>
              <tr>
                <td style={ST.tdLabel}>Investment Amount</td>
                <td style={ST.td}>
                  <strong>{formatUSD(amount)}</strong>
                </td>
              </tr>
              <tr>
                <td style={ST.tdLabel}>Tenure</td>
                <td style={ST.td}>{product.tenure}</td>
              </tr>
              <tr>
                <td style={ST.tdLabel}>Dividends Payout</td>
                <td style={ST.td}>{product.payout}</td>
              </tr>
              <tr>
                <td style={ST.tdLabel}>Subscription Fee</td>
                <td style={ST.td}>{product.subscriptionFee}</td>
              </tr>
              <tr>
                <td style={ST.tdLabel}>Management Fee</td>
                <td style={ST.td}>{product.managementFee}</td>
              </tr>
              <tr>
                <td style={ST.tdLabel}>Performance Fee</td>
                <td style={ST.td}>
                  {product.code === "TPM"
                    ? `${profitShareInvestor}% to Investor / ${profitShareManager}% to Manager (on net profits)`
                    : product.performanceFee}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Product-specific projection section */}
          {product.code === "FPM" && (
            <>
              <h2 style={ST.sectionHeading}>
                Single Contribution Deposit — Projected Returns
              </h2>

              {/* Scenario A — Client's Amount */}
              <p
                style={{
                  ...ST.pBold,
                  marginTop: 4,
                  marginBottom: 6,
                  color: BOA.primaryBlue,
                }}
              >
                Scenario A — {formatUSD(amount)}
              </p>
              <table style={ST.table}>
                <thead>
                  <tr>
                    <th style={ST.th}>Year</th>
                    <th style={ST.th}>Deposit</th>
                    <th style={ST.th}>Fixed Return (Net)</th>
                    <th style={ST.th}>Fixed Amount Per Annum</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={ST.td}>
                      <strong>Year 1</strong>
                    </td>
                    <td style={ST.td}>{formatUSD(amount)}</td>
                    <td style={ST.td}>10%</td>
                    <td style={ST.td}>
                      <strong>{formatUSD(amount * 0.1)}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style={ST.td}>
                      <strong>Year 2 (Optional)</strong>
                    </td>
                    <td
                      style={{
                        ...ST.td,
                        textAlign: "center",
                        color: BOA.textGray,
                      }}
                    >
                      —
                    </td>
                    <td style={ST.td}>12%</td>
                    <td style={ST.td}>
                      <strong>{formatUSD(amount * 0.12)}</strong>
                    </td>
                  </tr>
                  <tr style={{ background: BOA.rowAltBg }}>
                    <td style={{ ...ST.td, fontWeight: 700 }} colSpan="3">
                      Total Dividends (2 Years)
                    </td>
                    <td
                      style={{
                        ...ST.td,
                        fontWeight: 700,
                        color: BOA.primaryBlue,
                      }}
                    >
                      {formatUSD(amount * 0.22)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: BOA.tableRowBorder,
                  margin: "16px 0 14px",
                }}
              />

              {/* Scenario B — 2x Amount */}
              <p
                style={{ ...ST.pBold, marginBottom: 6, color: BOA.primaryBlue }}
              >
                Scenario B — {formatUSD(amount * 2)}
              </p>
              <table style={ST.table}>
                <thead>
                  <tr>
                    <th style={ST.th}>Year</th>
                    <th style={ST.th}>Deposit</th>
                    <th style={ST.th}>Fixed Return (Net)</th>
                    <th style={ST.th}>Fixed Amount Per Annum</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={ST.td}>
                      <strong>Year 1</strong>
                    </td>
                    <td style={ST.td}>{formatUSD(amount * 2)}</td>
                    <td style={ST.td}>10%</td>
                    <td style={ST.td}>
                      <strong>{formatUSD(amount * 2 * 0.1)}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style={ST.td}>
                      <strong>Year 2 (Optional)</strong>
                    </td>
                    <td
                      style={{
                        ...ST.td,
                        textAlign: "center",
                        color: BOA.textGray,
                      }}
                    >
                      —
                    </td>
                    <td style={ST.td}>12%</td>
                    <td style={ST.td}>
                      <strong>{formatUSD(amount * 2 * 0.12)}</strong>
                    </td>
                  </tr>
                  <tr style={{ background: BOA.rowAltBg }}>
                    <td style={{ ...ST.td, fontWeight: 700 }} colSpan="3">
                      Total Dividends (2 Years)
                    </td>
                    <td
                      style={{
                        ...ST.td,
                        fontWeight: 700,
                        color: BOA.primaryBlue,
                      }}
                    >
                      {formatUSD(amount * 2 * 0.22)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <p style={ST.note}>
                <strong>Note:</strong> Returns are stated net of management
                fees. Year 2 participation is optional and subject to renewal
                terms. Dividends are paid semi-annually.
              </p>
            </>
          )}

          {product.code === "TPM" && (
            <>
              <h2 style={ST.sectionHeading}>
                Track Record — Monthly Gross Performance
              </h2>
              <p style={ST.p}>
                The TPM strategy has delivered consistent positive returns every
                single month since inception in March 2022 —{" "}
                <strong>50 of 50 months</strong> in positive territory through
                April 2026.
              </p>
              <p style={{ ...ST.note, marginBottom: 10 }}>
                <em>
                  Source: BOA Alphaline TPM internal performance records.
                  Returns shown are gross of fees. Past performance is not a
                  reliable indicator of future results.
                </em>
              </p>

              <h2 style={ST.sectionHeading}>Performance Highlights</h2>
              <table style={ST.table}>
                <thead>
                  <tr>
                    <th style={{ ...ST.th, textAlign: "center" }}>Inception</th>
                    <th style={{ ...ST.th, textAlign: "center" }}>
                      Positive Months
                    </th>
                    <th style={{ ...ST.th, textAlign: "center" }}>
                      Avg Monthly Gross
                    </th>
                    <th style={{ ...ST.th, textAlign: "center" }}>
                      Best Month
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ ...ST.td, textAlign: "center" }}>
                      <strong>Mar 2022</strong>
                    </td>
                    <td style={{ ...ST.td, textAlign: "center" }}>
                      <strong>50 / 50</strong>
                    </td>
                    <td style={{ ...ST.td, textAlign: "center" }}>
                      <strong>~2.22%</strong>
                    </td>
                    <td style={{ ...ST.td, textAlign: "center" }}>
                      <strong>8.91%</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}

          {product.code === "IGPM" && (
            <>
              <h2 style={ST.sectionHeading}>
                Return Structure — Income + Growth
              </h2>

              {/* Scenario A — Client's Amount */}
              <p
                style={{
                  ...ST.pBold,
                  marginTop: 4,
                  marginBottom: 6,
                  color: BOA.primaryBlue,
                }}
              >
                Scenario A — {formatUSD(amount)}
              </p>
              <table style={ST.table}>
                <thead>
                  <tr>
                    <th style={ST.th}>Component</th>
                    <th style={ST.th}>Rate</th>
                    <th style={ST.th}>On {formatUSD(amount)}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={ST.td}>
                      <strong>Fixed Annual Dividend</strong>
                    </td>
                    <td style={ST.td}>6% p.a.</td>
                    <td style={ST.td}>
                      <strong>{formatUSD(amount * 0.06)} per year</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style={ST.td}>
                      <strong>Capital Growth (per cycle)</strong>
                    </td>
                    <td style={ST.td}>10% – 20%</td>
                    <td style={ST.td}>
                      <strong>
                        {formatUSD(amount * 0.1)} – {formatUSD(amount * 0.2)}
                      </strong>
                    </td>
                  </tr>
                  <tr style={{ background: BOA.rowAltBg }}>
                    <td style={{ ...ST.td, fontWeight: 700 }}>
                      Total Per Cycle (illustrative)
                    </td>
                    <td style={{ ...ST.td, fontWeight: 700 }}>16% – 26%</td>
                    <td
                      style={{
                        ...ST.td,
                        fontWeight: 700,
                        color: BOA.primaryBlue,
                      }}
                    >
                      {formatUSD(amount * 0.16)} – {formatUSD(amount * 0.26)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: BOA.tableRowBorder,
                  margin: "16px 0 14px",
                }}
              />

              {/* Scenario B — 2x Amount */}
              <p
                style={{ ...ST.pBold, marginBottom: 6, color: BOA.primaryBlue }}
              >
                Scenario B — {formatUSD(amount * 2)}
              </p>
              <table style={ST.table}>
                <thead>
                  <tr>
                    <th style={ST.th}>Component</th>
                    <th style={ST.th}>Rate</th>
                    <th style={ST.th}>On {formatUSD(amount * 2)}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={ST.td}>
                      <strong>Fixed Annual Dividend</strong>
                    </td>
                    <td style={ST.td}>6% p.a.</td>
                    <td style={ST.td}>
                      <strong>{formatUSD(amount * 2 * 0.06)} per year</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style={ST.td}>
                      <strong>Capital Growth (per cycle)</strong>
                    </td>
                    <td style={ST.td}>10% – 20%</td>
                    <td style={ST.td}>
                      <strong>
                        {formatUSD(amount * 2 * 0.1)} –{" "}
                        {formatUSD(amount * 2 * 0.2)}
                      </strong>
                    </td>
                  </tr>
                  <tr style={{ background: BOA.rowAltBg }}>
                    <td style={{ ...ST.td, fontWeight: 700 }}>
                      Total Per Cycle (illustrative)
                    </td>
                    <td style={{ ...ST.td, fontWeight: 700 }}>16% – 26%</td>
                    <td
                      style={{
                        ...ST.td,
                        fontWeight: 700,
                        color: BOA.primaryBlue,
                      }}
                    >
                      {formatUSD(amount * 2 * 0.16)} –{" "}
                      {formatUSD(amount * 2 * 0.26)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <p style={ST.note}>
                <strong>Note:</strong> 1 cycle = 2 years. Fixed dividend is paid
                annually based on cycle starting capital. Capital growth ranges
                between 10–20% per cycle subject to mandate performance. Maximum
                drawdown profile is approximately 25%.
              </p>
            </>
          )}

          {!splitsAcrossTwoPages && (
            <>
              <h2 style={ST.sectionHeading}>Strategic Benefits</h2>
              {displayBenefits.map((b, i) => (
                <p key={i} style={ST.bullet}>
                  <span style={ST.bulletDot}>•</span>
                  <strong>{b.title}</strong> — {b.desc}
                </p>
              ))}

              <h2 style={ST.sectionHeading}>Client Value</h2>
              {displayClientValue.map((v, i) => (
                <p key={i} style={ST.bullet}>
                  <span style={ST.bulletDot}>•</span>
                  {v}
                </p>
              ))}
            </>
          )}
        </div>
      </section>

      {/* TPM-only middle page — Monthly Performance Grid + YTD Returns */}
      {product.code === "TPM" && (
        <section className="boa-page" style={pageStyle}>
          <div className="boa-content" style={contentStyle}>
            <h2 style={ST.sectionHeading}>{sectionTitle} — Continued</h2>

            <h2 style={ST.sectionHeading}>
              Cross Exchange Arbitrage Performance
            </h2>
            {(() => {
              // Monthly performance grid - matches BOA's official deck
              const monthLabels = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ];
              const yearData = [
                {
                  year: "2022",
                  months: [
                    null,
                    null,
                    "3.52%",
                    "2.43%",
                    "2.67%",
                    "4.58%",
                    "2.38%",
                    "2.32%",
                    "3.2%",
                    "2.54%",
                    "3.71%",
                    "2.59%",
                  ],
                  ytd: "29.94%",
                },
                {
                  year: "2023",
                  months: [
                    "2.03%",
                    "4.3%",
                    "0.27%",
                    "0.67%",
                    "2.41%",
                    "1.16%",
                    "0.1%",
                    "1.45%",
                    "1.37%",
                    "3.84%",
                    "2.94%",
                    "4.52%",
                  ],
                  ytd: "25.06%",
                },
                {
                  year: "2024",
                  months: [
                    "2.85%",
                    "0.9%",
                    "8.91%",
                    "2.97%",
                    "0.82%",
                    "2.34%",
                    "1.53%",
                    "0.5%",
                    "0.51%",
                    "1.05%",
                    "2.6%",
                    "2.58%",
                  ],
                  ytd: "27.56%",
                },
                {
                  year: "2025",
                  months: [
                    "1.43%",
                    "1.1%",
                    "1.48%",
                    "1.83%",
                    "2.63%",
                    "1.61%",
                    "2.17%",
                    "1.56%",
                    "2.8%",
                    "2.31%",
                    "1.06%",
                    "0.97%",
                  ],
                  ytd: "20.95%",
                },
                {
                  year: "2026",
                  months: [
                    "2.13%",
                    "1.55%",
                    "1.46%",
                    "1.36%",
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                  ],
                  ytd: "6.50%",
                },
              ];
              const gridTh = {
                background: BOA.tableHeaderBg,
                color: "#FFFFFF",
                padding: "5px 2px",
                textAlign: "center",
                fontWeight: 700,
                fontSize: 8.5,
                border: `1px solid ${BOA.tableHeaderBg}`,
              };
              const gridYearLabel = {
                background: "#2680C2",
                color: "#FFFFFF",
                padding: "6px 4px",
                textAlign: "center",
                fontWeight: 700,
                fontSize: 9,
                border: `1px solid #FFFFFF`,
              };
              const gridDataGreen = {
                background: "#16A34A",
                color: "#FFFFFF",
                padding: "6px 2px",
                textAlign: "center",
                fontWeight: 600,
                fontSize: 8.5,
                border: `1px solid #FFFFFF`,
              };
              const gridDataEmpty = {
                background: "#FFFFFF",
                padding: "6px 2px",
                border: `1px solid #E5E7EB`,
              };
              const gridDataYTD = {
                background: "#BAE6FD",
                color: "#1E3A6B",
                padding: "6px 4px",
                textAlign: "center",
                fontWeight: 700,
                fontSize: 9,
                border: `1px solid #FFFFFF`,
              };
              return (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    margin: "8px 0 12px",
                    tableLayout: "fixed",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ ...gridTh, width: "8%" }}>Year</th>
                      {monthLabels.map((m) => (
                        <th key={m} style={{ ...gridTh, width: "6.3%" }}>
                          {m}
                        </th>
                      ))}
                      <th style={{ ...gridTh, width: "8.4%" }}>YTD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearData.map((row) => (
                      <tr key={row.year}>
                        <td style={gridYearLabel}>{row.year}</td>
                        {row.months.map((val, i) => (
                          <td
                            key={i}
                            style={val ? gridDataGreen : gridDataEmpty}
                          >
                            {val || ""}
                          </td>
                        ))}
                        <td style={gridDataYTD}>{row.ytd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()}
            <p
              style={{
                ...ST.note,
                fontSize: 9,
                marginTop: 4,
                marginBottom: 14,
              }}
            >
              <em>
                For informational purposes only. Past performance is not
                indicative of future results.
              </em>
            </p>

            <h2 style={ST.sectionHeading}>Year-to-Date Returns by Year</h2>
            <table style={ST.table}>
              <thead>
                <tr>
                  <th style={ST.th}>Year</th>
                  <th style={ST.th}>Months Active</th>
                  <th style={ST.th}>YTD Gross Return</th>
                  <th style={ST.th}>
                    YTD Net Return{" "}
                    <span style={{ fontSize: 9, opacity: 0.85 }}>
                      (after {profitShareInvestor}/{profitShareManager} split)
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    label: "2022 (from Mar)",
                    months: "10 months",
                    gross: 29.94,
                  },
                  { label: "2023", months: "12 months", gross: 25.06 },
                  { label: "2024", months: "12 months", gross: 27.56 },
                  { label: "2025", months: "12 months", gross: 20.95 },
                  { label: "2026 (YTD)", months: "4 months", gross: 6.5 },
                ].map((r) => {
                  const net = ((r.gross * profitShareInvestor) / 100).toFixed(
                    2
                  );
                  return (
                    <tr key={r.label}>
                      <td style={ST.td}>
                        <strong>{r.label}</strong>
                      </td>
                      <td style={ST.td}>{r.months}</td>
                      <td
                        style={{ ...ST.td, color: BOA.green, fontWeight: 700 }}
                      >
                        {r.gross.toFixed(2)}%
                      </td>
                      <td
                        style={{
                          ...ST.td,
                          color: BOA.primaryBlue,
                          fontWeight: 700,
                        }}
                      >
                        {net}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p style={ST.note}>
              <em>
                Source: BOA Alphaline TPM internal performance records. Returns
                shown are gross of fees. Past performance is not a reliable
                indicator of future results.
              </em>
            </p>
          </div>
        </section>
      )}

      {/* Page 2 (or 3 for TPM) — Strategic Benefits + Client Value */}
      {splitsAcrossTwoPages && (
        <section className="boa-page" style={pageStyle}>
          <div className="boa-content" style={contentStyle}>
            <h2 style={ST.sectionHeading}>{sectionTitle} — Continued</h2>

            <h2 style={ST.sectionHeading}>Strategic Benefits</h2>
            {displayBenefits.map((b, i) => (
              <p key={i} style={ST.bullet}>
                <span style={ST.bulletDot}>•</span>
                <strong>{b.title}</strong> — {b.desc}
              </p>
            ))}

            <h2 style={ST.sectionHeading}>Client Value</h2>
            {displayClientValue.map((v, i) => (
              <p key={i} style={ST.bullet}>
                <span style={ST.bulletDot}>•</span>
                {v}
              </p>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

// ============================================================================
// COMBINED PORTFOLIO PAGES (Why Both, Comparison, Allocation Framework)
// ============================================================================
function CombinedPortfolioPages({
  products,
  ST,
  pageStyle,
  contentStyle,
  profitShareInvestor = 70,
  profitShareManager = 30,
}) {
  const codes = products.map((p) => p.code);
  const isFpmTpm = codes.includes("FPM") && codes.includes("TPM");
  const isFpmIgpm = codes.includes("FPM") && codes.includes("IGPM");
  const isTpmIgpm = codes.includes("TPM") && codes.includes("IGPM");

  const comparisonRows = [
    {
      attr: "Strategy",
      values: products.map((p) => p.type.replace(" Strategy", "")),
      combined: codes.includes("FPM")
        ? "Income + Growth"
        : "Diversified Growth",
    },
    {
      attr: "Return Profile",
      values: products.map((p) =>
        p.code === "FPM"
          ? "Fixed (10–12% net)"
          : p.code === "TPM"
          ? "Variable (~21–30% gross p.a. track record)"
          : "6% fixed + 10–20% growth"
      ),
      combined: "Stable base + upside",
    },
    {
      attr: "Liquidity",
      values: products.map((p) => p.tenure),
      combined: "Layered liquidity",
    },
    {
      attr: "Payout Frequency",
      values: products.map((p) =>
        p.payout.split(" + ")[0].replace(" p.a.", "").replace("Fixed ", "")
      ),
      combined: "Year-round cash flow",
    },
    {
      attr: "Risk Profile",
      values: products.map((p) => p.riskProfile),
      combined: "Diversified",
    },
    {
      attr: "Performance Fee",
      values: products.map((p) =>
        p.code === "TPM"
          ? `${profitShareInvestor}% Investor / ${profitShareManager}% Manager`
          : p.performanceFee
      ),
      combined: "Investor-favourable",
    },
    {
      attr: "Best Suited For",
      values: products.map((p) =>
        p.code === "FPM"
          ? "Capital preservation"
          : p.code === "TPM"
          ? "Active growth"
          : "Income + growth in one"
      ),
      combined: "Holistic wealth strategy",
    },
  ];

  return (
    <>
      {/* Combined page 1 — Why Both + Comparison */}
      <section className="boa-page" style={pageStyle}>
        <div className="boa-content" style={contentStyle}>
          <h2 style={ST.sectionHeading}>
            Portfolio Rationale — Why Both, Not Either
          </h2>
          <p style={ST.p}>
            {isFpmTpm && (
              <>
                FPM and TPM are designed to work together. Each addresses a
                different investor need; combined, they deliver a portfolio that
                is both stable and dynamic — a defensive income foundation
                paired with an actively managed growth engine where the investor
                takes {profitShareInvestor}% of all upside. Allocating across
                both mandates produces a portfolio that is greater than the sum
                of its parts.
              </>
            )}
            {isFpmIgpm && (
              <>
                FPM and IGPM are designed to complement each other. FPM delivers
                a defensive income foundation with capital protection, while
                IGPM adds a hybrid layer combining its own fixed-income floor
                with measured capital growth. Together they create a portfolio
                anchored by certainty and elevated by structured growth
                participation — without exposure to the higher volatility of
                pure growth strategies.
              </>
            )}
            {isTpmIgpm && (
              <>
                TPM and IGPM together combine TPM's flexible, actively-managed
                profit-sharing structure with IGPM's hybrid income-and-growth
                cycle. The investor benefits from year-round cash flow (TPM
                quarterly + IGPM annual fixed dividend) and dual exposure to
                upside — TPM's open-ended growth potential and IGPM's defined
                cycle-end capital appreciation.
              </>
            )}
          </p>

          <h2 style={ST.sectionHeading}>Side-by-Side Comparison</h2>
          <table style={ST.table}>
            <thead>
              <tr>
                <th style={ST.th}>Attribute</th>
                {products.map((p) => (
                  <th key={p.code} style={{ ...ST.th, textAlign: "center" }}>
                    {p.code}
                  </th>
                ))}
                <th style={{ ...ST.th, textAlign: "center" }}>
                  Combined Outcome
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={i}>
                  <td style={{ ...ST.tdLabel, width: "auto" }}>{row.attr}</td>
                  {row.values.map((v, j) => (
                    <td key={j} style={{ ...ST.td, textAlign: "center" }}>
                      {v}
                    </td>
                  ))}
                  <td
                    style={{
                      ...ST.td,
                      fontWeight: 700,
                      color: BOA.primaryBlue,
                      textAlign: "center",
                    }}
                  >
                    {row.combined}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Combined page 2 — Unique Features (all 6) */}
      <section className="boa-page" style={pageStyle}>
        <div className="boa-content" style={contentStyle}>
          <h2 style={ST.sectionHeading}>
            Unique Features of the Combined Allocation
          </h2>
          {[
            {
              title: "Layered Liquidity Profile",
              desc: "Each mandate offers a different liquidity rhythm. Together they balance commitment with optionality — you retain freedom to scale exposure up or down as needs evolve.",
            },
            {
              title: "Diversified Cash Flow",
              desc: "Different payout frequencies stagger across the calendar, producing multiple distribution events per year and a consistent income rhythm rather than lumpy annual payouts.",
            },
            {
              title: "Stable Base + Performance Upside",
              desc: "Each product contributes a different type of return — combining a defensive yield floor with structured upside participation for balanced risk-adjusted outcomes.",
            },
            {
              title: "Genuinely Aligned Incentives",
              desc: "BOA Alphaline's fee profiles are deliberately investor-favourable. The manager only earns meaningfully when the client does.",
            },
            {
              title: "Single-Manager Operational Simplicity",
              desc: "All mandates sit under the same regulated entity (BOA Alphaline Investment Limited, BVI FSC Approved Investment Manager), allowing for unified reporting, single onboarding, and consolidated beneficiary nomination — without the operational drag of multiple counterparties.",
            },
            {
              title: "Beneficiary & Legacy Continuity",
              desc: "All mandates support beneficiary nomination, ensuring continuity of asset transfer and minimising probate friction. Combined with the BVI structuring, this provides a robust framework for intergenerational wealth transfer.",
            },
          ].map((f, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <p style={{ ...ST.bullet, fontWeight: 700, marginBottom: 2 }}>
                <span style={ST.bulletDot}>•</span>
                {f.title}
              </p>
              <p
                style={{
                  fontSize: 11,
                  lineHeight: 1.55,
                  color: BOA.textBlack,
                  margin: "0 0 6px",
                  paddingLeft: 16,
                  textAlign: "justify",
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Combined page 3 — Illustrative Allocation Framework */}
      <section className="boa-page" style={pageStyle}>
        <div className="boa-content" style={contentStyle}>
          <h2 style={ST.sectionHeading}>Illustrative Allocation Framework</h2>
          <p style={ST.p}>
            While the optimal split depends on your liquidity needs, risk
            appetite, and time horizon, the framework below illustrates how the{" "}
            {codes.length} mandates may be blended:
          </p>
          <table style={ST.table}>
            <thead>
              <tr>
                <th style={ST.th}>Allocation Profile</th>
                {products.map((p) => (
                  <th key={p.code} style={{ ...ST.th, textAlign: "center" }}>
                    {p.code} Share
                  </th>
                ))}
                <th style={{ ...ST.th, textAlign: "center" }}>
                  Investor Profile
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...ST.tdLabel, width: "auto" }}>
                  Conservative Income
                </td>
                <td style={{ ...ST.td, textAlign: "center", fontWeight: 700 }}>
                  70%
                </td>
                <td style={{ ...ST.td, textAlign: "center", fontWeight: 700 }}>
                  30%
                </td>
                <td style={{ ...ST.td, textAlign: "center" }}>
                  Capital preservation, predictable income
                </td>
              </tr>
              <tr>
                <td style={{ ...ST.tdLabel, width: "auto" }}>Balanced</td>
                <td style={{ ...ST.td, textAlign: "center", fontWeight: 700 }}>
                  50%
                </td>
                <td style={{ ...ST.td, textAlign: "center", fontWeight: 700 }}>
                  50%
                </td>
                <td style={{ ...ST.td, textAlign: "center" }}>
                  Income with measured growth participation
                </td>
              </tr>
              <tr>
                <td style={{ ...ST.tdLabel, width: "auto" }}>
                  Growth-Oriented
                </td>
                <td style={{ ...ST.td, textAlign: "center", fontWeight: 700 }}>
                  30%
                </td>
                <td style={{ ...ST.td, textAlign: "center", fontWeight: 700 }}>
                  70%
                </td>
                <td style={{ ...ST.td, textAlign: "center" }}>
                  Active growth, retains some defensive yield
                </td>
              </tr>
            </tbody>
          </table>
          <p style={ST.note}>
            <em>
              Note: The above is illustrative and not a recommendation. The
              final allocation will be tailored to your individual profile and
              objectives during the Portfolio Structuring Session.
            </em>
          </p>
        </div>
      </section>
    </>
  );
}

// ============================================================================
// MAIN DASHBOARD
// ============================================================================
export default function Dashboard() {
  const [page, setPage] = useState("home");
  const [selected, setSelected] = useState(allTools[0]);

  function openTool(tool) {
    setSelected(tool);
    setPage("tool");
  }

  if (page === "tool") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: T.pageBg,
          color: T.textPrimary,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <main
          style={{ margin: "0 auto", maxWidth: 1152, padding: "32px 24px" }}
        >
          <button
            onClick={() => setPage("home")}
            style={{
              marginBottom: 24,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 700,
              color: T.gold,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontFamily: "inherit",
              letterSpacing: "0.05em",
            }}
          >
            <span>←</span> Back to Dashboard
          </button>

          <div
            style={{
              marginBottom: 28,
              borderBottom: `1px solid ${T.border}`,
              paddingBottom: 24,
            }}
          >
            <div style={S.goldRule}>
              <span style={S.goldRuleLine} />
              <p style={S.eyebrow}>
                {selected.type === "portfolio"
                  ? "Portfolio Tool"
                  : "Financial Calculator"}
              </p>
            </div>
            <h1 style={{ ...S.h1, marginTop: 14 }}>{selected.name}</h1>
            <p style={{ ...S.bodyMuted, maxWidth: 720 }}>{selected.short}</p>
          </div>

          {selected.name === "Alphaline FPM Calculator" ? (
            <FPMCalculator />
          ) : selected.name === "Alphaline IGPM Calculator" ? (
            <IGPMCalculator />
          ) : selected.name === "Exponential Growth Calculator" ? (
            <ExponentialCalculator />
          ) : selected.name === "FPM Mortgage Offset Strategy" ? (
            <FPMMortgageOffset />
          ) : selected.name === "FPM Hire Purchase Offset Strategy" ? (
            <FPMHirePurchaseOffset />
          ) : selected.name === "Client Portfolio Allocation" ? (
            <AllocationTool />
          ) : selected.name === "Client Portfolio Review" ? (
            <PortfolioReview />
          ) : (
            <GenericProjection selected={selected} />
          )}
        </main>
      </div>
    );
  }

  if (page === "proposal") {
    return <ProposalBuilder onBack={() => setPage("home")} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.pageBg,
        color: T.textPrimary,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <main style={{ margin: "0 auto", maxWidth: 1152, padding: "32px 24px" }}>
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: 40,
            borderBottom: `1px solid ${T.border}`,
            paddingBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1 1 auto", minWidth: 280 }}>
              <div style={S.goldRule}>
                <span style={S.goldRuleLine} />
                <p style={S.eyebrow}>Provestor · Advisory Toolkit</p>
              </div>
              <h1
                style={{
                  marginTop: 16,
                  fontSize: 56,
                  fontWeight: 600,
                  letterSpacing: "-0.04em",
                  color: T.navyText,
                  lineHeight: 1.05,
                }}
              >
                Assisting Tools Dashboard
              </h1>
            </div>
            <button
              onClick={() => setPage("proposal")}
              style={{
                marginTop: 8,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: T.navyBg,
                color: T.goldOnNavy,
                padding: "14px 22px",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                borderTop: `2px solid ${T.gold}`,
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = T.navyHover;
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 16px rgba(10,31,61,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = T.navyBg;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={{ fontSize: 16 }}>📄</span>
              Create Proposal
              <span>→</span>
            </button>
          </div>
          <p
            style={{
              marginTop: 16,
              maxWidth: 768,
              fontSize: 16,
              lineHeight: "28px",
              color: T.textMuted,
            }}
          >
            A centralized workspace for portfolio review, fund projections and
            client strategy discussion. Select a tool below to open its
            dedicated page.
          </p>
        </motion.header>

        {sections.map((section) => (
          <SectionCard
            key={section.title}
            section={section}
            onOpen={openTool}
          />
        ))}

        <footer
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${T.border}`,
            paddingTop: 20,
            fontSize: 11,
            lineHeight: "24px",
            color: T.textMuted,
          }}
        >
          <span>© 2026 Provestor · All rights reserved.</span>
          <span
            style={{
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              color: T.gold,
            }}
          >
            Private Wealth Advisory
          </span>
        </footer>
      </main>
    </div>
  );
}
