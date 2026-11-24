import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { TrackId } from '../types';

type LabId = 'case-math' | 'dcf' | 'saas' | 'capital';

interface PracticeLabProps {
  defaultTrackId: TrackId;
  passedMissions: string[];
  onPassMission: (missionId: string) => void;
}

const TRACK_TO_LAB: Record<TrackId, LabId> = {
  consulting: 'case-math',
  finance: 'dcf',
  product: 'saas',
  operations: 'capital',
};

interface CapitalProject {
  id: string;
  name: string;
  pillar: 'Growth' | 'Margin' | 'Platform';
  investmentM: number;
  npvM: number;
  roicPct: number;
  paybackYrs: number;
  risk: 'Low' | 'Medium' | 'High';
}

const CAPITAL_PROJECTS: CapitalProject[] = [
  {
    id: 'cap-1',
    name: 'Automated Regional Fulfillment Robotics',
    pillar: 'Margin',
    investmentM: 8,
    npvM: 14.5,
    roicPct: 24,
    paybackYrs: 2.3,
    risk: 'Low',
  },
  {
    id: 'cap-2',
    name: 'Enterprise Tiered Pricing & CPQ Rollout',
    pillar: 'Margin',
    investmentM: 4,
    npvM: 11.2,
    roicPct: 31,
    paybackYrs: 1.4,
    risk: 'Low',
  },
  {
    id: 'cap-3',
    name: 'Adjacent DACH Market Commercial Entry',
    pillar: 'Growth',
    investmentM: 9,
    npvM: 13.8,
    roicPct: 21,
    paybackYrs: 3.1,
    risk: 'Medium',
  },
  {
    id: 'cap-4',
    name: 'Niche SaaS Bolt-On Acquisition',
    pillar: 'Growth',
    investmentM: 12,
    npvM: 16.0,
    roicPct: 19,
    paybackYrs: 3.6,
    risk: 'Medium',
  },
  {
    id: 'cap-5',
    name: 'Legacy ERP Core Consolidation',
    pillar: 'Platform',
    investmentM: 6,
    npvM: 5.4,
    roicPct: 14,
    paybackYrs: 4.2,
    risk: 'Low',
  },
  {
    id: 'cap-6',
    name: 'Speculative Direct-to-Consumer Brand Launch',
    pillar: 'Growth',
    investmentM: 10,
    npvM: 3.2,
    roicPct: 9,
    paybackYrs: 5.5,
    risk: 'High',
  },
];

export function PracticeLab({
  defaultTrackId,
  passedMissions,
  onPassMission,
}: PracticeLabProps) {
  const [activeLab, setActiveLab] = useState<LabId>(TRACK_TO_LAB[defaultTrackId]);

  // --- LAB 1: CONSULTING CASE MATH & EBITDA BRIDGE ---
  const [unitPrice, setUnitPrice] = useState(100);
  const [volumeK, setVolumeK] = useState(1000); // thousands of units
  const [varCost, setVarCost] = useState(64);
  const [fixedM, setFixedM] = useState(24);
  const [leverPricing, setLeverPricing] = useState(false);
  const [leverProcurement, setLeverProcurement] = useState(false);
  const [leverMix, setLeverMix] = useState(false);
  const [leverSga, setLeverSga] = useState(false);

  const caseMetrics = useMemo(() => {
    const effPrice = unitPrice * (leverPricing ? 1.05 : 1) * (leverMix ? 1.04 : 1);
    const effVolK = volumeK * (leverPricing ? 0.98 : 1);
    const effVarCost = varCost * (leverProcurement ? 0.91 : 1);
    const effFixedM = fixedM * (leverSga ? 0.88 : 1);

    const revenueM = (effPrice * effVolK) / 1000;
    const totalVarM = (effVarCost * effVolK) / 1000;
    const grossProfitM = revenueM - totalVarM;
    const ebitdaM = grossProfitM - effFixedM;
    const ebitdaMarginPct = revenueM > 0 ? (ebitdaM / revenueM) * 100 : 0;

    return {
      revenueM: Number(revenueM.toFixed(1)),
      totalVarM: Number(totalVarM.toFixed(1)),
      grossProfitM: Number(grossProfitM.toFixed(1)),
      effFixedM: Number(effFixedM.toFixed(1)),
      ebitdaM: Number(ebitdaM.toFixed(1)),
      ebitdaMarginPct: Number(ebitdaMarginPct.toFixed(1)),
      status:
        ebitdaMarginPct >= 20
          ? ('nominal' as const)
          : ebitdaMarginPct >= 12
          ? ('caution' as const)
          : ('critical' as const),
    };
  }, [unitPrice, volumeK, varCost, fixedM, leverPricing, leverProcurement, leverMix, leverSga]);

  // --- LAB 2: DCF VALUATION & WACC SENSITIVITY ---
  const [baseFcfM, setBaseFcfM] = useState(40);
  const [fcfGrowth, setFcfGrowth] = useState(12);
  const [waccPct, setWaccPct] = useState(9.5);
  const [tgrPct, setTgrPct] = useState(2.5);
  const [netDebtM, setNetDebtM] = useState(120);

  const dcfMetrics = useMemo(() => {
    const w = waccPct / 100;
    const g = fcfGrowth / 100;
    const tgr = tgrPct / 100;
    const rows: { year: number; fcf: number; discountFactor: number; pv: number }[] = [];
    let pvExplicit = 0;

    for (let yr = 1; yr <= 5; yr++) {
      const fcf = baseFcfM * Math.pow(1 + g, yr);
      const df = 1 / Math.pow(1 + w, yr);
      const pv = fcf * df;
      pvExplicit += pv;
      rows.push({
        year: yr,
        fcf: Number(fcf.toFixed(1)),
        discountFactor: Number(df.toFixed(3)),
        pv: Number(pv.toFixed(1)),
      });
    }

    const fcf5 = rows[4].fcf;
    const spread = Math.max(0.015, w - tgr);
    const terminalVal = (fcf5 * (1 + tgr)) / spread;
    const pvTerminal = terminalVal / Math.pow(1 + w, 5);
    const enterpriseValue = pvExplicit + pvTerminal;
    const equityValue = Math.max(0, enterpriseValue - netDebtM);
    const tvSharePct = Math.round((pvTerminal / enterpriseValue) * 100);
    const impliedEvFcf = Number((enterpriseValue / baseFcfM).toFixed(1));

    return {
      rows,
      pvExplicit: Math.round(pvExplicit),
      pvTerminal: Math.round(pvTerminal),
      enterpriseValue: Math.round(enterpriseValue),
      equityValue: Math.round(equityValue),
      tvSharePct,
      impliedEvFcf,
      validTerminal: tgrPct <= 3.5 && waccPct - tgrPct >= 4.0,
    };
  }, [baseFcfM, fcfGrowth, waccPct, tgrPct, netDebtM]);

  // --- LAB 3: SAAS UNIT ECONOMICS & GROWTH ENGINE ---
  const [arpa, setArpa] = useState(600);
  const [grossMargin, setGrossMargin] = useState(80);
  const [monthlyChurn, setMonthlyChurn] = useState(2.5);
  const [cac, setCac] = useState(6500);
  const [annualExpansion, setAnnualExpansion] = useState(18);

  const saasMetrics = useMemo(() => {
    const monthlyGm = arpa * (grossMargin / 100);
    const ltv = Math.round(monthlyGm / (monthlyChurn / 100));
    const ltvCac = Number((ltv / cac).toFixed(1));
    const paybackMonths = Number((cac / monthlyGm).toFixed(1));
    const annualLogoRetention = Math.pow(1 - monthlyChurn / 100, 12) * 100;
    const ndrPct = Math.round(annualLogoRetention + annualExpansion);

    // Build 24-month cumulative contribution curve points for SVG
    const points: { month: number; cumProfit: number }[] = [];
    let cumulative = -cac;
    let alive = 1.0;
    for (let m = 0; m <= 24; m++) {
      points.push({ month: m, cumProfit: Math.round(cumulative) });
      cumulative += monthlyGm * alive;
      alive *= 1 - monthlyChurn / 100;
    }

    return {
      ltv,
      ltvCac,
      paybackMonths,
      ndrPct,
      points,
      status:
        ltvCac >= 3.5 && paybackMonths <= 14 && ndrPct >= 110
          ? ('nominal' as const)
          : ltvCac >= 2.2 && paybackMonths <= 20
          ? ('caution' as const)
          : ('critical' as const),
    };
  }, [arpa, grossMargin, monthlyChurn, cac, annualExpansion]);

  // --- LAB 4: CAPITAL ALLOCATION & ROIC PORTFOLIO ---
  const CAPEX_BUDGET_M = 25;
  const [selectedProjects, setSelectedProjects] = useState<string[]>(['cap-1', 'cap-6']);

  const toggleProject = (id: string) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const capitalSummary = useMemo(() => {
    const chosen = CAPITAL_PROJECTS.filter((p) => selectedProjects.includes(p.id));
    const totalInvestM = chosen.reduce((s, p) => s + p.investmentM, 0);
    const totalNpvM = Number(chosen.reduce((s, p) => s + p.npvM, 0).toFixed(1));
    const weightedRoic =
      totalInvestM > 0
        ? Number(
            (
              chosen.reduce((s, p) => s + p.roicPct * p.investmentM, 0) / totalInvestM
            ).toFixed(1)
          )
        : 0;
    const hasHighRisk = chosen.some((p) => p.risk === 'High');
    const overBudget = totalInvestM > CAPEX_BUDGET_M;
    return { chosen, totalInvestM, totalNpvM, weightedRoic, hasHighRisk, overBudget };
  }, [selectedProjects]);

  // 12 Verifiable Post-MBA Practice Missions
  const caseMissions = [
    {
      id: 'mba-case-m1',
      title: 'Restore 20%+ EBITDA Margin',
      rule: 'Use pricing, procurement, mix, or SG&A levers to lift EBITDA margin ≥ 20.0%.',
      check: caseMetrics.ebitdaMarginPct >= 20.0,
    },
    {
      id: 'mba-case-m2',
      title: 'Hit $22M+ EBITDA Without Raising Base Price',
      rule: 'Keep base Unit Price ≤ $100 and Tiered Pricing OFF while achieving EBITDA ≥ $22.0M.',
      check: unitPrice <= 100 && !leverPricing && caseMetrics.ebitdaM >= 22.0,
    },
    {
      id: 'mba-case-m3',
      title: 'Survive Cost Inflation ($72+ Variable Cost)',
      rule: 'Set Variable Cost ≥ $72/unit and still protect ≥ 15.0% EBITDA margin.',
      check: varCost >= 72 && caseMetrics.ebitdaMarginPct >= 15.0,
    },
  ];

  const dcfMissions = [
    {
      id: 'mba-dcf-m1',
      title: 'Defensible $1B+ Enterprise Value',
      rule: 'Reach EV ≥ $1,000M with realistic Terminal Growth ≤ 3.0% and WACC ≥ 8.5%.',
      check: dcfMetrics.enterpriseValue >= 1000 && tgrPct <= 3.0 && waccPct >= 8.5,
    },
    {
      id: 'mba-dcf-m2',
      title: 'Stress-Test High-Rate Environment (WACC ≥ 11.5%)',
      rule: 'Raise WACC ≥ 11.5% and observe Equity Value stay above $450M.',
      check: waccPct >= 11.5 && dcfMetrics.equityValue >= 450,
    },
    {
      id: 'mba-dcf-m3',
      title: 'Disciplined Terminal Weight (TV ≤ 70% of EV)',
      rule: 'Keep Terminal Value share ≤ 70% of Enterprise Value with valid WACC − g spread.',
      check: dcfMetrics.tvSharePct <= 70 && dcfMetrics.validTerminal,
    },
  ];

  const saasMissions = [
    {
      id: 'mba-saas-m1',
      title: 'Institutional B2B Benchmark (LTV:CAC ≥ 4× & Payback ≤ 12m)',
      rule: 'Tune ARPA, churn, or CAC so LTV:CAC ≥ 4.0× and CAC Payback ≤ 12.0 months.',
      check: saasMetrics.ltvCac >= 4.0 && saasMetrics.paybackMonths <= 12.0,
    },
    {
      id: 'mba-saas-m2',
      title: 'Achieve 115%+ Net Dollar Retention (NDR)',
      rule: 'Combine low monthly churn and annual expansion to reach NDR ≥ 115%.',
      check: saasMetrics.ndrPct >= 115,
    },
    {
      id: 'mba-saas-m3',
      title: 'Enterprise Upmarket Economics (CAC ≥ $10k, Payback ≤ 15m)',
      rule: 'Support an enterprise sales CAC ≥ $10,000 while keeping Payback ≤ 15.0 months.',
      check: cac >= 10000 && saasMetrics.paybackMonths <= 15.0,
    },
  ];

  const capitalMissions = [
    {
      id: 'mba-cap-m1',
      title: 'Maximize NPV ≥ $38M Within $25M Cap',
      rule: 'Select a portfolio totaling ≤ $25M investment with combined NPV ≥ $38.0M.',
      check: !capitalSummary.overBudget && capitalSummary.totalNpvM >= 38.0,
    },
    {
      id: 'mba-cap-m2',
      title: 'High-ROIC Discipline (Weighted ROIC ≥ 23%)',
      rule: 'Deploy at least $15M within budget while maintaining weighted ROIC ≥ 23.0%.',
      check:
        !capitalSummary.overBudget &&
        capitalSummary.totalInvestM >= 15 &&
        capitalSummary.weightedRoic >= 23.0,
    },
    {
      id: 'mba-cap-m3',
      title: 'Zero High-Risk Bets & 3+ Initiatives Funded',
      rule: 'Fund at least 3 projects within budget with zero High-Risk initiatives.',
      check:
        !capitalSummary.overBudget &&
        capitalSummary.chosen.length >= 3 &&
        !capitalSummary.hasHighRisk,
    },
  ];

  const renderMissionCard = (
    missions: { id: string; title: string; rule: string; check: boolean }[]
  ) => (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-[#0F172A]">
          Verifiable Case Missions
        </h3>
        <span className="text-xs font-mono tabular-nums text-[#64748B]">
          {missions.filter((m) => passedMissions.includes(m.id)).length} / {missions.length} passed
        </span>
      </div>
      <div className="space-y-3">
        {missions.map((m) => {
          const alreadyPassed = passedMissions.includes(m.id);
          return (
            <div
              key={m.id}
              className={`p-4 rounded-lg border transition-colors ${
                alreadyPassed
                  ? 'border-[#A7F3D0] bg-[#ECFDF5]/60'
                  : m.check
                  ? 'border-[#1D4ED8] bg-[#EFF6FF]/60'
                  : 'border-[#E2E8F0] bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-[#0F172A]">{m.title}</div>
                  <p className="mt-1 text-xs text-[#475569]">{m.rule}</p>
                </div>
                {alreadyPassed ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#047857] whitespace-nowrap shrink-0">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    <span>Passed</span>
                  </span>
                ) : m.check ? (
                  <button
                    type="button"
                    onClick={() => onPassMission(m.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-md whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Claim Pass</span>
                  </button>
                ) : (
                  <span className="text-xs font-medium text-[#64748B] whitespace-nowrap shrink-0">
                    In progress
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // SVG Waterfall helper dimensions for Lab 1
  const maxBarM = Math.max(120, caseMetrics.revenueM * 1.12);
  const scaleH = (val: number) => Math.max(4, Math.round((Math.abs(val) / maxBarM) * 115));

  // SVG path for Lab 3 SaaS Payback Curve
  const maxSaasY = Math.max(
    6000,
    ...saasMetrics.points.map((p) => Math.abs(p.cumProfit))
  );
  const saasPolyline = saasMetrics.points
    .map((pt) => {
      const x = 44 + (pt.month / 24) * 580;
      const y = 92 - (pt.cumProfit / maxSaasY) * 72;
      return `${x.toFixed(1)},${Math.max(12, Math.min(168, y)).toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="space-y-8 pt-6">
      {/* Header & Lab Selector */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E2E8F0]">
        <div>
          <p className="text-sm font-medium text-[#1D4ED8] mb-2">
            Post-MBA Case &amp; Financial Modeling Labs
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#0F172A]">
            Drill boardroom math before superday.
          </h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#64748B]">
            <span>4 Interactive Executive Sandboxes</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {passedMissions.length} / 12 missions verified
            </span>
            <span aria-hidden="true">·</span>
            <span>Live deterministic financial calculations</span>
          </div>
        </div>

        <div
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#EEF2F6] rounded-lg border border-[#E2E8F0] self-start lg:self-auto"
          role="tablist"
          aria-label="Post-MBA Practice Labs"
        >
          {(
            [
              { id: 'case-math', label: 'EBITDA Case Bridge' },
              { id: 'dcf', label: 'DCF Valuation' },
              { id: 'saas', label: 'SaaS Unit Economics' },
              { id: 'capital', label: 'Capital Allocation' },
            ] as { id: LabId; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeLab === tab.id}
              onClick={() => setActiveLab(tab.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeLab === tab.id
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* LAB 1: CONSULTING CASE MATH & EBITDA BRIDGE */}
      {activeLab === 'case-math' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
              <div>
                <h2 className="text-xl font-semibold text-[#0F172A]">
                  Profitability Turnaround &amp; EBITDA Waterfall Simulator
                </h2>
                <p className="mt-1 text-sm text-[#475569]">
                  Model how unit pricing, variable COGS, fixed SG&amp;A, and consulting turnaround levers flow straight to EBITDA margin.
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                  caseMetrics.status === 'nominal'
                    ? 'text-[#047857]'
                    : caseMetrics.status === 'caution'
                    ? 'text-[#B45309]'
                    : 'text-[#B91C1C]'
                }`}
              >
                {caseMetrics.status === 'nominal' ? (
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                )}
                <span>
                  {caseMetrics.status === 'nominal'
                    ? 'Target Margin Met'
                    : caseMetrics.status === 'caution'
                    ? 'Moderate Margin'
                    : 'Compressed EBITDA'}
                </span>
              </span>
            </div>

            {/* Live SVG P&L Waterfall Chart */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 overflow-x-auto">
              <svg
                viewBox="0 0 640 175"
                className="w-full min-w-[500px] h-auto"
                role="img"
                aria-label="Live P&L to EBITDA waterfall diagram"
              >
                <line x1="28" y1="142" x2="612" y2="142" stroke="#CBD5E1" strokeWidth="1" />

                {/* Revenue */}
                <rect
                  x="60"
                  y={142 - scaleH(caseMetrics.revenueM)}
                  width="92"
                  height={scaleH(caseMetrics.revenueM)}
                  rx="4"
                  fill="#1D4ED8"
                />
                <text x="106" y={134 - scaleH(caseMetrics.revenueM)} textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="600" fontFamily="IBM Plex Mono">
                  ${caseMetrics.revenueM}M
                </text>
                <text x="106" y="160" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="Plus Jakarta Sans">
                  Revenue
                </text>

                {/* Variable COGS */}
                <rect
                  x="200"
                  y={142 - scaleH(caseMetrics.totalVarM)}
                  width="92"
                  height={scaleH(caseMetrics.totalVarM)}
                  rx="4"
                  fill="#94A3B8"
                />
                <text x="246" y={134 - scaleH(caseMetrics.totalVarM)} textAnchor="middle" fill="#475569" fontSize="12" fontWeight="600" fontFamily="IBM Plex Mono">
                  −${caseMetrics.totalVarM}M
                </text>
                <text x="246" y="160" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="Plus Jakarta Sans">
                  Variable COGS
                </text>

                {/* Fixed SG&A */}
                <rect
                  x="340"
                  y={142 - scaleH(caseMetrics.effFixedM)}
                  width="92"
                  height={scaleH(caseMetrics.effFixedM)}
                  rx="4"
                  fill="#CBD5E1"
                />
                <text x="386" y={134 - scaleH(caseMetrics.effFixedM)} textAnchor="middle" fill="#475569" fontSize="12" fontWeight="600" fontFamily="IBM Plex Mono">
                  −${caseMetrics.effFixedM}M
                </text>
                <text x="386" y="160" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="Plus Jakarta Sans">
                  Fixed SG&amp;A
                </text>

                {/* EBITDA */}
                <rect
                  x="480"
                  y={142 - scaleH(Math.max(0, caseMetrics.ebitdaM))}
                  width="92"
                  height={scaleH(Math.max(0, caseMetrics.ebitdaM))}
                  rx="4"
                  fill={caseMetrics.ebitdaM >= 0 ? '#047857' : '#DC2626'}
                />
                <text x="526" y={134 - scaleH(Math.max(0, caseMetrics.ebitdaM))} textAnchor="middle" fill={caseMetrics.ebitdaM >= 0 ? '#047857' : '#DC2626'} fontSize="12" fontWeight="600" fontFamily="IBM Plex Mono">
                  ${caseMetrics.ebitdaM}M
                </text>
                <text x="526" y="160" textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="600" fontFamily="Plus Jakarta Sans">
                  EBITDA ({caseMetrics.ebitdaMarginPct}%)
                </text>
              </svg>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { id: 'c-price', label: 'Base Unit Price', val: unitPrice, min: 70, max: 140, step: 2, unit: '$', set: setUnitPrice },
                { id: 'c-vol', label: 'Annual Volume', val: volumeK, min: 600, max: 1500, step: 50, unit: 'k units', set: setVolumeK },
                { id: 'c-var', label: 'Variable Cost / Unit', val: varCost, min: 45, max: 85, step: 1, unit: '$', set: setVarCost },
                { id: 'c-fix', label: 'Fixed SG&A Overhead', val: fixedM, min: 14, max: 40, step: 1, unit: '$M', set: setFixedM },
              ].map((s) => (
                <div key={s.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label htmlFor={s.id} className="font-medium text-[#0F172A]">
                      {s.label}
                    </label>
                    <span className="font-mono font-semibold tabular-nums text-[#1D4ED8]">
                      {s.unit === '$' ? `$${s.val}` : `${s.val} ${s.unit}`}
                    </span>
                  </div>
                  <input
                    id={s.id}
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={s.val}
                    onChange={(e) => s.set(Number(e.target.value))}
                    className="w-full h-2 bg-[#E2E8F0] rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Consulting Turnaround Levers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                {
                  label: 'Tiered Value Pricing (+5% price, −2% vol)',
                  desc: 'Eliminates unapproved sales discounts across low-elasticity enterprise tiers.',
                  active: leverPricing,
                  toggle: () => setLeverPricing(!leverPricing),
                },
                {
                  label: 'Supplier Consolidation (−9% variable COGS)',
                  desc: 'Consolidates tail vendors under volume-rebate contracts.',
                  active: leverProcurement,
                  toggle: () => setLeverProcurement(!leverProcurement),
                },
                {
                  label: 'Premium SKU Mix Shift (+4% blended ASP)',
                  desc: 'Realigns field incentives toward higher-margin flagship bundles.',
                  active: leverMix,
                  toggle: () => setLeverMix(!leverMix),
                },
                {
                  label: 'SG&A Delayering (−12% fixed overhead)',
                  desc: 'Streamlines duplicate regional back-office spans and layers.',
                  active: leverSga,
                  toggle: () => setLeverSga(!leverSga),
                },
              ].map((lever) => (
                <button
                  key={lever.label}
                  type="button"
                  onClick={lever.toggle}
                  className={`text-left p-4 rounded-lg border transition-colors cursor-pointer ${
                    lever.active
                      ? 'border-[#1D4ED8] bg-[#EFF6FF]'
                      : 'border-[#E2E8F0] bg-white hover:border-[#94A3B8]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#0F172A]">
                      {lever.label}
                    </span>
                    <span
                      className={`text-xs font-mono font-semibold ${
                        lever.active ? 'text-[#1D4ED8]' : 'text-[#64748B]'
                      }`}
                    >
                      {lever.active ? 'ACTIVE' : 'OFF'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#475569]">{lever.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {renderMissionCard(caseMissions)}
          </div>
        </div>
      )}

      {/* LAB 2: DCF VALUATION & WACC SENSITIVITY */}
      {activeLab === 'dcf' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
              <div>
                <h2 className="text-xl font-semibold text-[#0F172A]">
                  5-Year Unlevered DCF &amp; Enterprise Value Workbench
                </h2>
                <p className="mt-1 text-sm text-[#475569]">
                  Adjust Free Cash Flow growth, WACC, Terminal Growth Rate (g), and Net Debt to observe live Enterprise-to-Equity value attribution.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBaseFcfM(40);
                  setFcfGrowth(12);
                  setWaccPct(9.5);
                  setTgrPct(2.5);
                  setNetDebtM(120);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#475569] border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset Model</span>
              </button>
            </div>

            {/* Summary KPI Readouts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B]">Enterprise Value</div>
                <div className="mt-1 text-xl font-semibold font-mono tabular-nums text-[#1D4ED8]">
                  ${dcfMetrics.enterpriseValue.toLocaleString()}M
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B]">Implied Equity Value</div>
                <div className="mt-1 text-xl font-semibold font-mono tabular-nums text-[#0F172A]">
                  ${dcfMetrics.equityValue.toLocaleString()}M
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B]">TV % of Total EV</div>
                <div className="mt-1 text-xl font-semibold font-mono tabular-nums text-[#0F172A]">
                  {dcfMetrics.tvSharePct}%
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B]">Implied EV / FCF₀</div>
                <div className="mt-1 text-xl font-semibold font-mono tabular-nums text-[#0F172A]">
                  {dcfMetrics.impliedEvFcf}×
                </div>
              </div>
            </div>

            {/* 5-Year Projected Cash Flows Table */}
            <div className="border border-[#E2E8F0] rounded-xl overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-semibold text-[#475569]">
                    <th className="py-3 px-4">Projection Period</th>
                    <th className="py-3 px-4 text-right">Unlevered FCF ($M)</th>
                    <th className="py-3 px-4 text-right">Discount Factor</th>
                    <th className="py-3 px-4 text-right">Present Value ($M)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] font-mono tabular-nums text-xs">
                  {dcfMetrics.rows.map((r) => (
                    <tr key={r.year} className="hover:bg-[#F8FAFC]">
                      <td className="py-2.5 px-4 font-sans font-medium text-[#0F172A]">
                        Year {r.year}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[#0F172A]">
                        ${r.fcf.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[#64748B]">
                        {r.discountFactor.toFixed(3)}
                      </td>
                      <td className="py-2.5 px-4 text-right font-semibold text-[#0F172A]">
                        ${r.pv.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-[#F8FAFC] font-semibold">
                    <td className="py-3 px-4 font-sans text-[#0F172A]">
                      PV of Explicit 5-Yr FCF + Terminal Value
                    </td>
                    <td className="py-3 px-4 text-right text-[#64748B]">
                      Explicit: ${dcfMetrics.pvExplicit}M
                    </td>
                    <td className="py-3 px-4 text-right text-[#64748B]">
                      PV of TV: ${dcfMetrics.pvTerminal}M
                    </td>
                    <td className="py-3 px-4 text-right text-[#1D4ED8]">
                      EV: ${dcfMetrics.enterpriseValue}M
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Valuation Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { id: 'dcf-base', label: 'Year-0 Base Unlevered FCF', val: baseFcfM, min: 15, max: 90, step: 5, unit: '$M', set: setBaseFcfM },
                { id: 'dcf-g', label: '5-Year Annual FCF Growth', val: fcfGrowth, min: 4, max: 24, step: 1, unit: '%', set: setFcfGrowth },
                { id: 'dcf-wacc', label: 'WACC (Discount Rate)', val: waccPct, min: 7.0, max: 14.0, step: 0.5, unit: '%', set: setWaccPct },
                { id: 'dcf-tgr', label: 'Terminal Growth Rate (g)', val: tgrPct, min: 1.0, max: 4.0, step: 0.25, unit: '%', set: setTgrPct },
                { id: 'dcf-debt', label: 'Net Debt (Debt − Cash)', val: netDebtM, min: 0, max: 400, step: 20, unit: '$M', set: setNetDebtM },
              ].map((s) => (
                <div key={s.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label htmlFor={s.id} className="font-medium text-[#0F172A]">
                      {s.label}
                    </label>
                    <span className="font-mono font-semibold tabular-nums text-[#1D4ED8]">
                      {s.unit === '$M' ? `$${s.val}M` : `${s.val}${s.unit}`}
                    </span>
                  </div>
                  <input
                    id={s.id}
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={s.val}
                    onChange={(e) => s.set(Number(e.target.value))}
                    className="w-full h-2 bg-[#E2E8F0] rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {renderMissionCard(dcfMissions)}
          </div>
        </div>
      )}

      {/* LAB 3: SAAS UNIT ECONOMICS & GROWTH ENGINE */}
      {activeLab === 'saas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
              <div>
                <h2 className="text-xl font-semibold text-[#0F172A]">
                  B2B SaaS Unit Economics &amp; CAC Payback Curve
                </h2>
                <p className="mt-1 text-sm text-[#475569]">
                  Model how pricing, churn, gross margin, and enterprise CAC shape cumulative 24-month cohort payback and Net Dollar Retention.
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                  saasMetrics.status === 'nominal'
                    ? 'text-[#047857]'
                    : saasMetrics.status === 'caution'
                    ? 'text-[#B45309]'
                    : 'text-[#B91C1C]'
                }`}
              >
                {saasMetrics.status === 'nominal' ? (
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                )}
                <span>
                  {saasMetrics.status === 'nominal'
                    ? 'Top-Quartile SaaS'
                    : saasMetrics.status === 'caution'
                    ? 'Tight Payback'
                    : 'Inefficient Funnel'}
                </span>
              </span>
            </div>

            {/* Live SVG Cohort Payback Curve */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 overflow-x-auto">
              <svg
                viewBox="0 0 650 185"
                className="w-full min-w-[500px] h-auto"
                role="img"
                aria-label="24-month customer cumulative gross profit payback curve"
              >
                {/* Breakeven zero line */}
                <line
                  x1="44"
                  y1="92"
                  x2="624"
                  y2="92"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text x="58" y="84" fill="#64748B" fontSize="10" fontFamily="Plus Jakarta Sans">
                  Breakeven ($0 CAC recovered)
                </text>

                {/* Cumulative profit curve */}
                <polyline
                  fill="none"
                  stroke="#1D4ED8"
                  strokeWidth="2.75"
                  points={saasPolyline}
                />

                {/* Axis labels */}
                <text x="44" y="178" fill="#64748B" fontSize="10" fontFamily="IBM Plex Mono">
                  Month 0 (−${cac.toLocaleString()})
                </text>
                <text x="334" y="178" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="IBM Plex Mono">
                  Month 12
                </text>
                <text x="624" y="178" textAnchor="end" fill="#0F172A" fontSize="10" fontWeight="600" fontFamily="IBM Plex Mono">
                  Month 24 (${saasMetrics.points[24].cumProfit.toLocaleString()})
                </text>
              </svg>
            </div>

            {/* Live SaaS Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B]">Customer LTV</div>
                <div className="mt-1 text-xl font-semibold font-mono tabular-nums text-[#0F172A]">
                  ${saasMetrics.ltv.toLocaleString()}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B]">LTV : CAC</div>
                <div className="mt-1 text-xl font-semibold font-mono tabular-nums text-[#1D4ED8]">
                  {saasMetrics.ltvCac}×
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B]">CAC Payback</div>
                <div className="mt-1 text-xl font-semibold font-mono tabular-nums text-[#0F172A]">
                  {saasMetrics.paybackMonths} mos
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B]">Net Dollar Retention</div>
                <div className="mt-1 text-xl font-semibold font-mono tabular-nums text-[#0F172A]">
                  {saasMetrics.ndrPct}%
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { id: 's-arpa', label: 'Monthly ARPA', val: arpa, min: 200, max: 2000, step: 50, unit: '$', set: setArpa },
                { id: 's-gm', label: 'SaaS Gross Margin', val: grossMargin, min: 60, max: 90, step: 2, unit: '%', set: setGrossMargin },
                { id: 's-churn', label: 'Monthly Logo Churn', val: monthlyChurn, min: 0.5, max: 6.0, step: 0.25, unit: '%', set: setMonthlyChurn },
                { id: 's-cac', label: 'Blended CAC', val: cac, min: 1500, max: 16000, step: 500, unit: '$', set: setCac },
                { id: 's-exp', label: 'Annual Seat/Usage Expansion', val: annualExpansion, min: 5, max: 40, step: 1, unit: '%', set: setAnnualExpansion },
              ].map((s) => (
                <div key={s.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label htmlFor={s.id} className="font-medium text-[#0F172A]">
                      {s.label}
                    </label>
                    <span className="font-mono font-semibold tabular-nums text-[#1D4ED8]">
                      {s.unit === '$' ? `$${s.val.toLocaleString()}` : `${s.val}${s.unit}`}
                    </span>
                  </div>
                  <input
                    id={s.id}
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={s.val}
                    onChange={(e) => s.set(Number(e.target.value))}
                    className="w-full h-2 bg-[#E2E8F0] rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {renderMissionCard(saasMissions)}
          </div>
        </div>
      )}

      {/* LAB 4: CAPITAL ALLOCATION & ROIC PORTFOLIO */}
      {activeLab === 'capital' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
              <div>
                <h2 className="text-xl font-semibold text-[#0F172A]">
                  Annual Board Capital Allocator ($25M Investment Cap)
                </h2>
                <p className="mt-1 text-sm text-[#475569]">
                  As General Manager, allocate a fixed $25M investment pool across competing operating bets to maximize NPV and weighted ROIC.
                </p>
              </div>
              <span
                className={`text-xs font-mono font-semibold tabular-nums ${
                  capitalSummary.overBudget ? 'text-[#B91C1C]' : 'text-[#047857]'
                }`}
              >
                ${capitalSummary.totalInvestM}M / ${CAPEX_BUDGET_M}M allocated
              </span>
            </div>

            {/* Budget Capacity Bar */}
            <div className="space-y-1.5">
              <div className="h-2.5 w-full bg-[#EEF2F6] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-150 ${
                    capitalSummary.overBudget ? 'bg-[#DC2626]' : 'bg-[#1D4ED8]'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (capitalSummary.totalInvestM / CAPEX_BUDGET_M) * 100
                    )}%`,
                  }}
                />
              </div>
              {capitalSummary.overBudget && (
                <p className="text-xs font-medium text-[#B91C1C]">
                  Over board capital limit by ${capitalSummary.totalInvestM - CAPEX_BUDGET_M}M—defer a lower-ROIC bet to stay funded.
                </p>
              )}
            </div>

            {/* Portfolio Totals */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B]">Combined 5-Yr NPV</div>
                <div className="mt-1 text-2xl font-semibold font-mono tabular-nums text-[#0F172A]">
                  ${capitalSummary.totalNpvM}M
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B]">Weighted Portfolio ROIC</div>
                <div className="mt-1 text-2xl font-semibold font-mono tabular-nums text-[#1D4ED8]">
                  {capitalSummary.weightedRoic}%
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B]">Funded Initiatives</div>
                <div className="mt-1 text-2xl font-semibold font-mono tabular-nums text-[#0F172A]">
                  {capitalSummary.chosen.length} / {CAPITAL_PROJECTS.length}
                </div>
              </div>
            </div>

            {/* Selectable Capital Bets */}
            <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-xl overflow-hidden">
              {CAPITAL_PROJECTS.map((item) => {
                const selected = selectedProjects.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleProject(item.id)}
                    className={`w-full text-left p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors cursor-pointer ${
                      selected ? 'bg-[#EFF6FF]/60' : 'bg-white hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          selected
                            ? 'bg-[#1D4ED8] border-[#1D4ED8] text-white'
                            : 'border-[#94A3B8] bg-white'
                        }`}
                      >
                        {selected && <Check className="w-3 h-3" aria-hidden="true" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#0F172A]">
                          {item.name}
                        </div>
                        <div className="mt-1 text-xs text-[#64748B] font-mono tabular-nums">
                          {item.pillar} · Payback {item.paybackYrs} yrs · {item.risk} Risk
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 shrink-0 font-mono tabular-nums text-xs">
                      <div className="text-right">
                        <div className="text-[#64748B]">Cost</div>
                        <div className="font-semibold text-[#0F172A]">
                          ${item.investmentM}M
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#64748B]">ROIC</div>
                        <div className="font-semibold text-[#0F172A]">
                          {item.roicPct}%
                        </div>
                      </div>
                      <div className="text-right min-w-[60px]">
                        <div className="text-[#64748B]">NPV</div>
                        <div className="font-semibold text-[#1D4ED8]">
                          ${item.npvM}M
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {renderMissionCard(capitalMissions)}
          </div>
        </div>
      )}
    </div>
  );
}
