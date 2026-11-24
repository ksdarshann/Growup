import { CareerTrack, InterviewQuestion, ResumeData, TrackId } from '../types';

export const HERO_IMAGE_PATH =
  `${import.meta.env.BASE_URL}src/assets/images/hero_learning_studio_1795531335147.jpg`;

export const CAREER_TRACKS: CareerTrack[] = [
  {
    id: 'consulting',
    title: 'Management Consulting & Strategy',
    shortTitle: 'Consulting',
    tagline:
      'Master MECE issue trees, rapid case math, profitability turnarounds, market entry sizing, and executive Pyramid Principle storytelling for MBB and Tier-1 firms.',
    image: `${import.meta.env.BASE_URL}src/assets/images/track_mba_consulting_1795532347580.jpg`,
    imageAlt:
      'Management consulting case prep desk with MECE issue tree diagrams in a linen notebook and strategy slide printout',
    totalHours: 72,
    salaryBand: '$190k–$235k',
    levelRange: 'Post-MBA Consultant / Associate',
    coreTools: ['MECE Structuring', 'Case Math', 'Pyramid Principle', 'Market Sizing', 'Slide Synthesis'],
    portfolioBrief: {
      title: 'Board-Ready Market Entry & Turnaround Case Pack',
      summary:
        'Assemble a 6-slide McKinsey/Bain-style executive deck diagnosing a stagnant B2B firm, sizing an adjacent geography, and presenting a 24-month EBITDA expansion roadmap.',
      deliverables: [
        'One-page Situation–Complication–Resolution (SCR) executive summary',
        'MECE profitability & market-entry issue tree with quantified hypotheses',
        'Bottom-up + top-down market sizing triangulation model with sensitivity table',
        'Risk-mitigated 18-month implementation roadmap with owner milestones',
      ],
    },
    recommendedSkills: [
      'Corporate Strategy',
      'MECE Problem Structuring',
      'Commercial Due Diligence',
      'Market Sizing & Entry',
      'P&L Turnaround',
      'Executive Storytelling',
      'Pricing Optimization',
      'Stakeholder Alignment',
    ],
    modules: [
      {
        id: 'con-1',
        stageNumber: 1,
        title: 'MECE Issue Trees & Hypothesis-Driven Structuring',
        durationHours: 16,
        summary:
          'Break ambiguous CEO problems into Mutually Exclusive, Collectively Exhaustive drivers so you never boil the ocean during a 35-minute case.',
        keyTakeaways: [
          'Lead with a testable Day-1 hypothesis, then design 3–4 non-overlapping branches tailored to the specific industry economics.',
          'Avoid reciting canned frameworks verbatim; adapt profitability, 3Cs, or value-chain buckets to the client’s actual business model.',
          'Explicitly prioritize which branch you want to test first and state what data would confirm or refute your hypothesis.',
        ],
        subSkills: [
          'Custom issue-tree construction under 90 seconds',
          'Separating revenue volume, mix, and price levers',
          'Hypothesis-first interviewer signposting',
        ],
        conceptModel: {
          title: 'Case Pacing & Branch Depth Allocator',
          prompt:
            'Balance your upfront structuring time against branch count in a 35-minute Post-MBA case interview to ensure time for synthesis.',
          formulaLabel: 'Minutes Per Branch = (35 − Structuring − Synthesis) / Branches',
          sliders: [
            {
              id: 'branches',
              label: 'Primary Issue Tree Branches',
              min: 2,
              max: 7,
              step: 1,
              defaultValue: 4,
              unit: 'buckets',
            },
            {
              id: 'prepMin',
              label: 'Upfront Structuring Time',
              min: 1,
              max: 6,
              step: 0.5,
              defaultValue: 2,
              unit: 'min',
            },
          ],
          evaluate: ({ branches = 4, prepMin = 2 }) => {
            const analysisMin = 35 - prepMin - 4;
            const perBranch = Number((analysisMin / branches).toFixed(1));
            if (branches >= 3 && branches <= 4 && prepMin <= 2.5) {
              return {
                primaryMetricLabel: 'Analysis / Branch',
                primaryMetricValue: `${perBranch} min`,
                secondaryMetricLabel: 'Structure Clarity',
                secondaryMetricValue: 'Partner-Ready',
                status: 'nominal',
                statusLabel: 'Crisp & MECE',
                insight:
                  '3–4 clean branches structured in ~2 minutes give you deep time per driver while preserving 4 minutes for an executive recommendation.',
              };
            }
            if (branches > 5) {
              return {
                primaryMetricLabel: 'Analysis / Branch',
                primaryMetricValue: `${perBranch} min`,
                secondaryMetricLabel: 'Structure Clarity',
                secondaryMetricValue: 'Fragmented',
                status: 'critical',
                statusLabel: 'Too Many Buckets',
                insight:
                  'Six or more top-level branches read like a laundry list rather than MECE synthesis. Consolidate into 3–4 strategic pillars.',
              };
            }
            return {
              primaryMetricLabel: 'Analysis / Branch',
              primaryMetricValue: `${perBranch} min`,
              secondaryMetricLabel: 'Structure Clarity',
              secondaryMetricValue: branches < 3 ? 'Too Narrow' : 'Slow Ramp',
              status: 'caution',
              statusLabel: 'Adjust Cadence',
              insight:
                branches < 3
                  ? 'Only 2 buckets often miss crucial risks (e.g., implementation feasibility or competitive response).'
                  : 'Taking over 3 minutes of silence stalls momentum. Sketch the clean tree in 90–120 seconds and refine interactively.',
            };
          },
        },
        masteryQuestion: {
          prompt:
            'A regional hospital chain’s net margin fell 6 points while patient volume rose 10%. What is the sharpest first hypothesis to test?',
          options: [
            'Marketing spend must be too low because brand awareness is weak',
            'Either payer/procedure revenue mix shifted toward lower-reimbursement cases or variable clinical labor/supply costs surged faster than revenue',
            'They should immediately open three new hospitals to capture scale',
          ],
          correctIndex: 1,
          explanation:
            'Rising volume paired with falling margin immediately isolates unit economics: revenue mix/pricing per patient or variable operating cost inflation.',
        },
      },
      {
        id: 'con-2',
        stageNumber: 2,
        title: 'Market Sizing & Commercial Triangulation',
        durationHours: 18,
        summary:
          'Estimate unfamiliar markets rapidly using clean population or installed-base anchors, replacement cycles, and sanity-check bounds.',
        keyTakeaways: [
          'Always narrate your formula before plugging in numbers so interviewers can follow your logic and course-correct early.',
          'Segment by usage intensity (heavy, medium, light) or enterprise tier rather than applying one flat average.',
          'Sanity-check the final answer from a second angle (e.g., % of GDP, revenue per capita, or public competitor market share).',
        ],
        subSkills: [
          'Demand-side vs. supply-side sizing trees',
          'Mental math rounding & order-of-magnitude checks',
          'Converting TAM → SAM → realistic Year-3 SOM',
        ],
        conceptModel: {
          title: 'B2B Market Entry Sizing Sensitivity Explorer',
          prompt:
            'Model realistic Year-3 Serviceable Obtainable Market (SOM) by adjusting target enterprise accounts, win rate, and annual contract value.',
          formulaLabel: 'Year-3 Revenue = Target Accounts × Penetration % × ACV',
          sliders: [
            {
              id: 'accounts',
              label: 'Addressable Mid-Market Accounts',
              min: 1000,
              max: 20000,
              step: 1000,
              defaultValue: 8000,
              unit: 'firms',
            },
            {
              id: 'sharePct',
              label: 'Year-3 Target Capture Share',
              min: 1,
              max: 15,
              step: 1,
              defaultValue: 4,
              unit: '%',
            },
          ],
          evaluate: ({ accounts = 8000, sharePct = 4 }) => {
            const acv = 45000;
            const wonAccounts = Math.round(accounts * (sharePct / 100));
            const revM = Number(((wonAccounts * acv) / 1_000_000).toFixed(1));
            if (revM >= 12 && sharePct <= 8) {
              return {
                primaryMetricLabel: 'Year-3 Implied Revenue',
                primaryMetricValue: `$${revM}M`,
                secondaryMetricLabel: 'Accounts Required',
                secondaryMetricValue: wonAccounts.toLocaleString(),
                status: 'nominal',
                statusLabel: 'Attractive Entry',
                insight:
                  'Meaningful revenue scale achieved at a defensible market share assumption without requiring incumbent displacement overnight.',
              };
            }
            if (sharePct > 8) {
              return {
                primaryMetricLabel: 'Year-3 Implied Revenue',
                primaryMetricValue: `$${revM}M`,
                secondaryMetricLabel: 'Accounts Required',
                secondaryMetricValue: wonAccounts.toLocaleString(),
                status: 'caution',
                statusLabel: 'Aggressive Share',
                insight:
                  'Capturing >8% of an established B2B market in 3 years requires a clear switching wedge or channel partnership.',
              };
            }
            return {
              primaryMetricLabel: 'Year-3 Implied Revenue',
              primaryMetricValue: `$${revM}M`,
              secondaryMetricLabel: 'Accounts Required',
              secondaryMetricValue: wonAccounts.toLocaleString(),
              status: 'critical',
              statusLabel: 'Sub-Scale Market',
              insight:
                'Even with disciplined execution, absolute revenue may not justify standalone entry cost. Test higher ACV or adjacent segments.',
            };
          },
        },
        masteryQuestion: {
          prompt:
            'When sizing the annual US commercial tire replacement market, which driver is easiest to overlook?',
          options: [
            'The number of wheels per truck and the replacement interval (miles driven per year ÷ tire lifespan)',
            'The total US human population',
            'The color of the truck fleet',
          ],
          correctIndex: 0,
          explanation:
            'Installed-base sizing hinges on fleet count × tires per vehicle × annual replacement frequency—missing replacement cycle turns total installed base into an inflated annual figure.',
        },
      },
      {
        id: 'con-3',
        stageNumber: 3,
        title: 'Profitability Bridges, Pricing & Operating Leverage',
        durationHours: 20,
        summary:
          'Diagnose EBITDA margin compression across price, volume, product mix, variable COGS, and fixed cost utilization.',
        keyTakeaways: [
          'A 1% pure price increase typically lifts operating profit by 6–10%—far higher leverage than a 1% volume gain.',
          'High fixed-cost businesses (airlines, software, manufacturing) enjoy huge incremental margins once past breakeven.',
          'Always compute breakeven volume before recommending promotional discounts or new capital investments.',
        ],
        subSkills: [
          'Contribution margin & breakeven math',
          'Price elasticity vs. volume trade-off analysis',
          'Fixed vs. variable cost benchmarking',
        ],
        conceptModel: {
          title: 'Price Cut vs. Required Volume Offset Calculator',
          prompt:
            'Test how much unit volume must grow just to break even on gross profit when a sales team discounts price.',
          formulaLabel: 'Required Volume Lift = Discount % / (Gross Margin % − Discount %)',
          sliders: [
            {
              id: 'marginPct',
              label: 'Baseline Gross Margin',
              min: 20,
              max: 75,
              step: 5,
              defaultValue: 40,
              unit: '%',
            },
            {
              id: 'discountPct',
              label: 'Proposed Price Discount',
              min: 2,
              max: 25,
              step: 1,
              defaultValue: 10,
              unit: '%',
            },
          ],
          evaluate: ({ marginPct = 40, discountPct = 10 }) => {
            if (discountPct >= marginPct) {
              return {
                primaryMetricLabel: 'Required Volume Lift',
                primaryMetricValue: 'Unrecoverable',
                secondaryMetricLabel: 'Post-Cut Margin',
                secondaryMetricValue: `${marginPct - discountPct}%`,
                status: 'critical',
                statusLabel: 'Negative Contribution',
                insight:
                  'Discounting wipes out contribution margin completely—every extra unit sold destroys cash.',
              };
            }
            const reqLift = Math.round((discountPct / (marginPct - discountPct)) * 100);
            const newMargin = Math.round(((marginPct - discountPct) / (100 - discountPct)) * 100);
            if (reqLift <= 20) {
              return {
                primaryMetricLabel: 'Required Volume Lift',
                primaryMetricValue: `+${reqLift}%`,
                secondaryMetricLabel: 'Post-Cut Margin',
                secondaryMetricValue: `${newMargin}%`,
                status: 'nominal',
                statusLabel: 'Testable Promo',
                insight:
                  'High baseline margin absorbs a modest discount; verify price elasticity exceeds the required volume lift.',
              };
            }
            if (reqLift <= 45) {
              return {
                primaryMetricLabel: 'Required Volume Lift',
                primaryMetricValue: `+${reqLift}%`,
                secondaryMetricLabel: 'Post-Cut Margin',
                secondaryMetricValue: `${newMargin}%`,
                status: 'caution',
                statusLabel: 'Steep Hurdle',
                insight: `Sales must move +${reqLift}% more units just to stand still on gross profit dollars. Consider targeted bundling instead.`,
              };
            }
            return {
              primaryMetricLabel: 'Required Volume Lift',
              primaryMetricValue: `+${reqLift}%`,
              secondaryMetricLabel: 'Post-Cut Margin',
              secondaryMetricValue: `${newMargin}%`,
              status: 'critical',
              statusLabel: 'Value-Destructive Cut',
              insight: `A ${discountPct}% discount at ${marginPct}% margin demands an unrealistic +${reqLift}% volume surge just to break even.`,
            };
          },
        },
        masteryQuestion: {
          prompt:
            'A B2B distributor has a 30% gross margin and proposes a 10% across-the-board price cut to win share. How much must unit volume increase just to maintain current gross profit dollars?',
          options: ['+10%', '+33%', '+50%'],
          correctIndex: 2,
          explanation:
            'Margin drops from 30 cents per dollar to 20 cents per dollar (a one-third drop in unit profit), requiring 30/20 = 1.5× volume (+50%) just to break even.',
        },
      },
      {
        id: 'con-4',
        stageNumber: 4,
        title: 'Executive Synthesis & Pyramid Principle',
        durationHours: 18,
        summary:
          'Deliver decisive, answer-first C-suite recommendations backed by 2–3 quantified pillars, key risks, and immediate next steps.',
        keyTakeaways: [
          'Start with the governing recommendation first—never walk an executive chronologically through your scratchpad math.',
          'Anchor every supporting pillar with an explicit dollar, margin, or timeline figure from the case exhibits.',
          'Close with the single biggest execution risk and a concrete Day-1 mitigation step.',
        ],
        subSkills: [
          '60-second answer-first verbal synthesis',
          'Action-title executive slide writing',
          'Handling partner pushback gracefully',
        ],
        conceptModel: {
          title: 'Executive Recommendation Structure Timer',
          prompt:
            'Allocate your 60-second final case synthesis across Answer, Supporting Proof, and Risks/Next Steps.',
          formulaLabel: 'Target Synthesis = Answer (10s) + 3 Proof Points (35s) + Risks/Next Steps (15s)',
          sliders: [
            {
              id: 'answerSec',
              label: 'Time Before Stating Recommendation',
              min: 5,
              max: 45,
              step: 5,
              defaultValue: 10,
              unit: 'sec',
            },
            {
              id: 'quantPoints',
              label: 'Quantified Proof Points Cited',
              min: 0,
              max: 4,
              step: 1,
              defaultValue: 3,
              unit: 'metrics',
            },
          ],
          evaluate: ({ answerSec = 10, quantPoints = 3 }) => {
            if (answerSec <= 12 && quantPoints >= 2 && quantPoints <= 3) {
              return {
                primaryMetricLabel: 'Executive Clarity',
                primaryMetricValue: 'Top-Down',
                secondaryMetricLabel: 'Evidence Density',
                secondaryMetricValue: `${quantPoints} anchors`,
                status: 'nominal',
                statusLabel: 'Board-Ready',
                insight:
                  'Leading immediately with the recommendation supported by 2–3 crisp metrics mirrors how consulting partners brief CEOs.',
              };
            }
            if (answerSec > 20) {
              return {
                primaryMetricLabel: 'Executive Clarity',
                primaryMetricValue: 'Bottom-Up',
                secondaryMetricLabel: 'Evidence Density',
                secondaryMetricValue: `${quantPoints} anchors`,
                status: 'critical',
                statusLabel: 'Buried Lead',
                insight:
                  'You waited too long to state your call. Flip the order: state "We recommend X" in your very first sentence.',
              };
            }
            return {
              primaryMetricLabel: 'Executive Clarity',
              primaryMetricValue: 'Moderate',
              secondaryMetricLabel: 'Evidence Density',
              secondaryMetricValue: `${quantPoints} anchors`,
              status: 'caution',
              statusLabel: quantPoints < 2 ? 'Light Proof' : 'Tighten Scope',
              insight:
                quantPoints < 2
                  ? 'Add exact numbers ($ impact, payback period, margin lift) so the recommendation feels indisputable.'
                  : 'Four+ metrics blur together verbally; group into your top 3 highest-impact pillars.',
            };
          },
        },
        masteryQuestion: {
          prompt:
            'You are asked to deliver your final recommendation to the client CEO. Which opening line follows the Pyramid Principle?',
          options: [
            '"First we looked at market size, then we checked fixed costs, and finally we calculated breakeven..."',
            '"We recommend acquiring Target B for up to $140M, which lifts annual EBITDA by $24M within 18 months—driven by three quantified synergies."',
            '"There are pros and cons to both options, so it depends on what the board prefers."',
          ],
          correctIndex: 1,
          explanation:
            'Answer-first synthesis states a clear commitment, anchors the headline financial impact, and previews the supporting structure immediately.',
        },
      },
    ],
  },
  {
    id: 'finance',
    title: 'Investment Banking & Corporate Finance',
    shortTitle: 'IB & Finance',
    tagline:
      'Build airtight 3-statement intuition, DCF & WACC valuations, LBO return bridges, and M&A accretion/dilution analysis for Associate recruiting.',
    image: `${import.meta.env.BASE_URL}src/assets/images/track_mba_finance_1795532347170.jpg`,
    imageAlt:
      'Corporate finance workspace with printed valuation summary sheet, drafting pen, and navy clothbound ledger',
    totalHours: 84,
    salaryBand: '$210k–$310k',
    levelRange: 'Post-MBA IB Associate / Corp Dev',
    coreTools: ['3-Statement Links', 'DCF & WACC', 'Comps & Precedents', 'LBO Modeling', 'M&A Accretion'],
    portfolioBrief: {
      title: 'Public Company Valuation & M&A Investment Memo',
      summary:
        'Author an institutional-grade pitch memo valuing a public mid-cap target across DCF, trading multiples, and LBO floor value with a clear strategic buyer recommendation.',
      deliverables: [
        'Linked 3-statement historical normalization and 5-year operating forecast',
        'Unlevered DCF valuation with WACC vs. Terminal Growth football-field chart',
        'Peer trading multiples (EV/EBITDA, EV/Revenue, P/E) & precedent transaction table',
        'Illustrative LBO sources & uses + 5-year IRR / MoIC sensitivity matrix',
      ],
    },
    recommendedSkills: [
      'Financial Modeling',
      'DCF & WACC Valuation',
      'LBO Analysis',
      'M&A Accretion / Dilution',
      'Accounting & 3-Statement Links',
      'Capital Structure',
      'Comparable Companies',
      'Deal Execution & Pitchbooks',
    ],
    modules: [
      {
        id: 'fin-1',
        stageNumber: 1,
        title: 'Three-Statement Accounting & Cash Flow Bridges',
        durationHours: 18,
        summary:
          'Trace any operating or financing event seamlessly across the Income Statement, Cash Flow Statement, and Balance Sheet without breaking balance.',
        keyTakeaways: [
          'Non-cash expenses like Depreciation lower taxes (creating a tax shield) and therefore increase Ending Cash by D&A × Tax Rate.',
          'An increase in an Operating Asset (like Inventory or A/R) is a use of cash; an increase in an Operating Liability (A/P, Deferred Revenue) is a source of cash.',
          'Enterprise Value reflects core operating assets available to all capital providers; Equity Value reflects what belongs solely to shareholders.',
        ],
        subSkills: [
          'Walking through $10 D&A / CapEx / Write-down questions',
          'Working capital & Deferred Revenue cash impact',
          'Enterprise Value vs. Equity Value bridge',
        ],
        conceptModel: {
          title: 'Depreciation Tax Shield & Cash Flow Walkthrough',
          prompt:
            'Adjust incremental Depreciation expense and corporate tax rate to observe exact impacts across all three financial statements.',
          formulaLabel: 'Δ Cash = +Δ D&A × Tax Rate (Operating Cash Flow Shield)',
          sliders: [
            {
              id: 'da',
              label: 'Incremental Depreciation (D&A)',
              min: 10,
              max: 100,
              step: 10,
              defaultValue: 20,
              unit: '$M',
            },
            {
              id: 'taxRate',
              label: 'Marginal Corporate Tax Rate',
              min: 15,
              max: 35,
              step: 5,
              defaultValue: 25,
              unit: '%',
            },
          ],
          evaluate: ({ da = 20, taxRate = 25 }) => {
            const netIncomeDelta = -Number((da * (1 - taxRate / 100)).toFixed(1));
            const cashDelta = Number((da * (taxRate / 100)).toFixed(1));
            return {
              primaryMetricLabel: 'Net Income Impact',
              primaryMetricValue: `${netIncomeDelta}M`,
              secondaryMetricLabel: 'Ending Cash Impact',
              secondaryMetricValue: `+$${cashDelta}M`,
              status: 'nominal',
              statusLabel: 'Balanced Sheet',
              insight: `Pre-tax income falls $${da}M, taxes fall $${cashDelta}M, so Net Income drops $${Math.abs(netIncomeDelta)}M. Adding back non-cash D&A (+$${da}M) lifts Cash by +$${cashDelta}M while PP&E falls $${da}M, balancing Equity (${netIncomeDelta}M).`,
            };
          },
        },
        masteryQuestion: {
          prompt:
            'A company buys $100M of equipment using cash (no depreciation in Year 0). What happens to the Balance Sheet immediately?',
          options: [
            'Total Assets increase by $100M',
            'Cash decreases by $100M and PP&E increases by $100M, so Total Assets remain unchanged',
            'Retained Earnings immediately drops by $100M',
          ],
          correctIndex: 1,
          explanation:
            'Capital expenditures are capitalized onto PP&E rather than expensed immediately on the Income Statement, leaving Total Assets unchanged on Day 0.',
        },
      },
      {
        id: 'fin-2',
        stageNumber: 2,
        title: 'DCF Valuation, WACC & Terminal Value Drivers',
        durationHours: 22,
        summary:
          'Compute Unlevered Free Cash Flow, derive CAPM cost of equity and WACC, and sanity-check Terminal Value assumptions.',
        keyTakeaways: [
          'Unlevered FCF = EBIT(1 − t) + D&A − CapEx − Δ Net Working Capital; always discount UFCF by WACC, never Cost of Equity.',
          'Terminal Value often drives 65–80% of total Enterprise Value—cross-check Perpetual Growth against implied Exit EV/EBITDA.',
          'Terminal growth rate (g) cannot sustainably exceed long-run nominal GDP growth (~2–3.5%).',
        ],
        subSkills: [
          'CAPM beta unlevering & relevering',
          'Gordon Growth vs. Exit Multiple Terminal Value',
          'Mid-year convention & diluted share count (TSM)',
        ],
        conceptModel: {
          title: 'WACC & Perpetual Growth Valuation Multiplier',
          prompt:
            'See how tiny shifts in WACC or Terminal Growth Rate (g) dramatically swing the implied Terminal Value multiple.',
          formulaLabel: 'Implied TV / FCF Multiple = (1 + g) / (WACC − g)',
          sliders: [
            {
              id: 'wacc',
              label: 'Discount Rate (WACC)',
              min: 6.5,
              max: 14.0,
              step: 0.5,
              defaultValue: 9.5,
              unit: '%',
            },
            {
              id: 'tgr',
              label: 'Terminal Growth Rate (g)',
              min: 1.0,
              max: 4.5,
              step: 0.25,
              defaultValue: 2.5,
              unit: '%',
            },
          ],
          evaluate: ({ wacc = 9.5, tgr = 2.5 }) => {
            const spread = Math.max(0.5, wacc - tgr);
            const multiple = Number(((1 + tgr / 100) / (spread / 100)).toFixed(1));
            if (tgr > 3.5) {
              return {
                primaryMetricLabel: 'Implied TV / FCF₅',
                primaryMetricValue: `${multiple}×`,
                secondaryMetricLabel: 'WACC − g Spread',
                secondaryMetricValue: `${spread.toFixed(2)}%`,
                status: 'critical',
                statusLabel: 'Unrealistic g',
                insight:
                  'Perpetual growth above 3.5% implies the company eventually outgrows the global economy. Cap g at 2.0–3.0%.',
              };
            }
            if (multiple >= 10 && multiple <= 22) {
              return {
                primaryMetricLabel: 'Implied TV / FCF₅',
                primaryMetricValue: `${multiple}×`,
                secondaryMetricLabel: 'WACC − g Spread',
                secondaryMetricValue: `${spread.toFixed(2)}%`,
                status: 'nominal',
                statusLabel: 'Defensible Range',
                insight:
                  'Reasonable spread yields an institutional multiple aligned with mature public peer trading comps.',
              };
            }
            return {
              primaryMetricLabel: 'Implied TV / FCF₅',
              primaryMetricValue: `${multiple}×`,
              secondaryMetricLabel: 'WACC − g Spread',
              secondaryMetricValue: `${spread.toFixed(2)}%`,
              status: 'caution',
              statusLabel: multiple > 22 ? 'High Sensitivity' : 'Steep Discount',
              insight:
                multiple > 22
                  ? 'Narrow WACC − g spread magnifies valuation swings—cross-check with an Exit EBITDA multiple.'
                  : 'High cost of capital compresses long-dated cash flows heavily; verify peer capital structure beta.',
            };
          },
        },
        masteryQuestion: {
          prompt:
            'If a company issues new debt to replace an equal amount of equity (within a healthy credit range), what usually happens to WACC initially?',
          options: [
            'WACC declines because debt is cheaper than equity and interest is tax-deductible',
            'WACC always doubles immediately',
            'WACC never changes regardless of leverage',
          ],
          correctIndex: 0,
          explanation:
            'Up to the point where distress risk spikes, replacing higher-cost equity with tax-advantaged debt lowers weighted average cost of capital.',
        },
      },
      {
        id: 'fin-3',
        stageNumber: 3,
        title: 'LBO Mechanics, Debt Capacity & IRR Drivers',
        durationHours: 22,
        summary:
          'Decompose private equity returns across EBITDA growth, debt paydown via free cash flow, and entry-vs-exit multiple arbitrage.',
        keyTakeaways: [
          'Ideal LBO candidates feature predictable recurring cash flows, low maintenance CapEx, and defensible market positions.',
          'Rule of 72 mental math: 2.0× MoIC in 5 years ≈ 15% IRR; 2.5× in 5 years ≈ 20% IRR; 3.0× in 5 years ≈ 25% IRR.',
          'Leverage amplifies Equity IRR only when the asset return exceeds the after-tax cost of debt.',
        ],
        subSkills: [
          'Paper LBO mental math under 10 minutes',
          'Sources & Uses and debt tranche structure',
          'IRR / MoIC attribution bridge',
        ],
        conceptModel: {
          title: '5-Year Paper LBO Return & Leverage Calculator',
          prompt:
            'Model a $100M EBITDA buyout at 8.0× Entry ($800M EV) by varying Entry Debt Leverage and Exit Multiple (assuming 5% annual EBITDA growth & $180M cumulative debt paydown).',
          formulaLabel: 'Sponsor Equity Exit = Exit EV − Remaining Net Debt',
          sliders: [
            {
              id: 'debtTurns',
              label: 'Initial Debt Leverage (× EBITDA)',
              min: 2.0,
              max: 6.0,
              step: 0.5,
              defaultValue: 4.5,
              unit: '×',
            },
            {
              id: 'exitMult',
              label: 'Year-5 Exit EV / EBITDA',
              min: 6.5,
              max: 11.0,
              step: 0.5,
              defaultValue: 8.5,
              unit: '×',
            },
          ],
          evaluate: ({ debtTurns = 4.5, exitMult = 8.5 }) => {
            const entryEv = 800;
            const entryDebt = debtTurns * 100;
            const sponsorEquity = entryEv - entryDebt;
            const exitEbitda = 100 * Math.pow(1.05, 5); // ~127.6M
            const exitEv = exitEbitda * exitMult;
            const endingDebt = Math.max(0, entryDebt - 180);
            const exitEquity = Math.max(0, exitEv - endingDebt);
            const moic = Number((exitEquity / sponsorEquity).toFixed(2));
            const irr = Math.round((Math.pow(Math.max(0.1, moic), 1 / 5) - 1) * 100);

            if (irr >= 20 && debtTurns <= 5.5) {
              return {
                primaryMetricLabel: '5-Year Sponsor IRR',
                primaryMetricValue: `${irr}%`,
                secondaryMetricLabel: 'Sponsor MoIC',
                secondaryMetricValue: `${moic}×`,
                status: 'nominal',
                statusLabel: 'Hits PE Hurdle',
                insight: `Investing $${sponsorEquity}M equity returns $${Math.round(exitEquity)}M—clearing the typical 20%+ institutional buyout hurdle.`,
              };
            }
            if (debtTurns > 5.5) {
              return {
                primaryMetricLabel: '5-Year Sponsor IRR',
                primaryMetricValue: `${irr}%`,
                secondaryMetricLabel: 'Sponsor MoIC',
                secondaryMetricValue: `${moic}×`,
                status: 'caution',
                statusLabel: 'High Covenant Risk',
                insight:
                  'Leverage above 5.5× pushes interest coverage thin in a downturn; credit committees will scrutinize downside cash flow.',
              };
            }
            return {
              primaryMetricLabel: '5-Year Sponsor IRR',
              primaryMetricValue: `${irr}%`,
              secondaryMetricLabel: 'Sponsor MoIC',
              secondaryMetricValue: `${moic}×`,
              status: irr >= 14 ? 'caution' : 'critical',
              statusLabel: irr >= 14 ? 'Below 20% Hurdle' : 'Weak Returns',
              insight:
                'Returns fall short of private equity targets—need stronger operational EBITDA expansion, lower entry multiple, or higher FCF conversion.',
            };
          },
        },
        masteryQuestion: {
          prompt:
            'In a 5-year LBO where a sponsor triples its equity investment (3.0× MoIC) with no interim dividends, what is the approximate IRR?',
          options: ['~15%', '~25%', '~35%'],
          correctIndex: 1,
          explanation:
            '3^(1/5) − 1 = 24.6% (~25% IRR). Memorizing key 5-year MoIC-to-IRR benchmarks (2.0× ≈ 15%, 2.5× ≈ 20%, 3.0× ≈ 25%) is essential for paper LBO interviews.',
        },
      },
      {
        id: 'fin-4',
        stageNumber: 4,
        title: 'M&A Accretion / Dilution & Deal Structuring',
        durationHours: 22,
        summary:
          'Evaluate stock vs. cash consideration, break-even synergies, goodwill creation, and strategic rationale for corporate acquisitions.',
        keyTakeaways: [
          'In an all-stock deal (no synergies), the merger is accretive to EPS if Acquirer P/E > Target Purchase P/E.',
          'In an all-cash or debt-funded deal, compare the Target’s earnings yield (1 / Purchase P/E) against after-tax cost of debt or foregone cash interest.',
          'Cost synergies are far more certain than revenue synergies; buyers rarely pay full value upfront for uncertain cross-sell projections.',
        ],
        subSkills: [
          'Quick mental EPS accretion / dilution test',
          'Cash vs. Debt vs. Stock financing trade-offs',
          'Purchase price allocation & Goodwill intuition',
        ],
        conceptModel: {
          title: 'All-Stock M&A Accretion / Dilution Quick-Check',
          prompt:
            'Compare Acquirer P/E against Target Purchase P/E (including control premium) to see immediate EPS direction before synergies.',
          formulaLabel: 'All-Stock Accretive when Acquirer P/E > Target Offer P/E',
          sliders: [
            {
              id: 'acqPe',
              label: 'Acquirer Standalone P/E',
              min: 10,
              max: 35,
              step: 1,
              defaultValue: 22,
              unit: '×',
            },
            {
              id: 'tgtPe',
              label: 'Target Purchase P/E (w/ Premium)',
              min: 10,
              max: 35,
              step: 1,
              defaultValue: 18,
              unit: '×',
            },
          ],
          evaluate: ({ acqPe = 22, tgtPe = 18 }) => {
            const acqYield = (100 / acqPe).toFixed(2);
            const tgtYield = (100 / tgtPe).toFixed(2);
            const spreadBps = Math.round((1 / tgtPe - 1 / acqPe) * 10000);
            if (acqPe > tgtPe) {
              return {
                primaryMetricLabel: 'Deal Impact (Pre-Synergy)',
                primaryMetricValue: 'Accretive',
                secondaryMetricLabel: 'Yield Spread',
                secondaryMetricValue: `+${spreadBps} bps`,
                status: 'nominal',
                statusLabel: 'EPS Accretive',
                insight: `Acquirer earnings yield (${acqYield}%) is lower than Target offer yield (${tgtYield}%): buying cheaper earnings with richer stock boosts combined EPS.`,
              };
            }
            if (acqPe === tgtPe) {
              return {
                primaryMetricLabel: 'Deal Impact (Pre-Synergy)',
                primaryMetricValue: 'Breakeven',
                secondaryMetricLabel: 'Yield Spread',
                secondaryMetricValue: '0 bps',
                status: 'caution',
                statusLabel: 'EPS Neutral',
                insight:
                  'Identical P/E multiples produce neutral Year-1 EPS before synergies and transaction amortization.',
              };
            }
            return {
              primaryMetricLabel: 'Deal Impact (Pre-Synergy)',
              primaryMetricValue: 'Dilutive',
              secondaryMetricLabel: 'Yield Spread',
              secondaryMetricValue: `${spreadBps} bps`,
              status: 'critical',
              statusLabel: 'EPS Dilutive',
              insight: `Paying ${tgtPe}× with ${acqPe}× stock dilutes Year-1 EPS. Management must quantify credible cost synergies or shift financing toward lower-cost debt.`,
            };
          },
        },
        masteryQuestion: {
          prompt:
            'Company A trades at 24× P/E and acquires Company B at an offer multiple of 18× P/E in a 100% stock transaction (zero synergies). What happens to Company A’s EPS?',
          options: [
            'Accretive—Acquirer is using higher-multiple stock to buy lower-multiple earnings',
            'Dilutive—issuing new shares always dilutes EPS',
            'Impossible to tell without knowing Company B’s headcount',
          ],
          correctIndex: 0,
          explanation:
            'Because Company A pays fewer shares per dollar of acquired Net Income than its own standalone ratio (24× > 18×), combined EPS increases.',
        },
      },
    ],
  },
  {
    id: 'product',
    title: 'Tech Product Management & Strategy',
    shortTitle: 'Tech PM & Strategy',
    tagline:
      'Bridge MBA commercial acumen with product intuition: size opportunities, engineer SaaS unit economics, design pricing tiers, and lead cross-functional launches.',
    image: `${import.meta.env.BASE_URL}src/assets/images/track_product_management_1795531337444.jpg`,
    imageAlt:
      'Product strategy desk with organized roadmap cards, linen planner, and brass pen on ash wood',
    totalHours: 68,
    salaryBand: '$175k–$245k',
    levelRange: 'Post-MBA Senior PM / Strategy & Ops',
    coreTools: ['Product Sense', 'SaaS Unit Economics', 'Pricing & Packaging', 'Executive PRDs', 'A/B Experimentation'],
    portfolioBrief: {
      title: 'B2B SaaS Growth, Pricing & Product Strategy Memo',
      summary:
        'Diagnose a real SaaS product’s monetization and retention bottlenecks, redesign packaging tiers with LTV/CAC math, and write an executive-ready 1-quarter PRD.',
      deliverables: [
        'Customer segmentation & Willingness-to-Pay (WTP) packaging analysis',
        'Unit economics model linking onboarding activation to LTV:CAC & CAC Payback',
        'Two-page executive PRD with north-star metrics, guardrails, and non-goals',
        'Staged enterprise/self-serve GTM launch plan with sales enablement alignment',
      ],
    },
    recommendedSkills: [
      'Product Strategy & Vision',
      'SaaS Unit Economics (LTV/CAC)',
      'Pricing & Packaging',
      'Go-to-Market Execution',
      'Cross-Functional Leadership',
      'Experimentation & Metrics',
      'Roadmap Prioritization',
      'Executive PRDs',
    ],
    modules: [
      {
        id: 'pm-1',
        stageNumber: 1,
        title: 'Product Sense, Market Wedges & Discovery',
        durationHours: 16,
        summary:
          'Connect business strategy to specific underserved user segments, articulate defensible distribution wedges, and avoid feature-factory roadmaps.',
        keyTakeaways: [
          'Structure product-sense prompts cleanly: Business Goal → User Segment → Acute Pain → Differentiated Solution → Trade-offs & Metrics.',
          'Post-MBA PMs stand out by pairing deep user empathy with monetization feasibility and competitive moat analysis.',
          'Validate value and willingness-to-pay risk before committing multi-quarter engineering cycles.',
        ],
        subSkills: [
          'Segmenting users by behavioral need, not just demographics',
          'Evaluating competitive moats (network effects, switching costs)',
          'Hypothesis-driven customer discovery',
        ],
        conceptModel: {
          title: 'Product Bet Risk vs. Strategic Upside Filter',
          prompt:
            'Weigh expected ARR opportunity against validation confidence to choose the right discovery vehicle before building.',
          formulaLabel: 'Expected Value = Annual ARR Upside × Confidence − Build Cost',
          sliders: [
            {
              id: 'upsideM',
              label: 'Projected Year-1 ARR Upside',
              min: 1,
              max: 25,
              step: 1,
              defaultValue: 8,
              unit: '$M',
            },
            {
              id: 'confidence',
              label: 'Customer Demand Confidence',
              min: 15,
              max: 90,
              step: 5,
              defaultValue: 40,
              unit: '%',
            },
          ],
          evaluate: ({ upsideM = 8, confidence = 40 }) => {
            const ev = Number((upsideM * (confidence / 100)).toFixed(1));
            if (confidence >= 70 && ev >= 4) {
              return {
                primaryMetricLabel: 'Risk-Adjusted ARR',
                primaryMetricValue: `$${ev}M`,
                secondaryMetricLabel: 'Discovery Action',
                secondaryMetricValue: 'Scope & Build',
                status: 'nominal',
                statusLabel: 'Validated Bet',
                insight:
                  'Strong demand evidence justifies immediate engineering kickoff with a tight v1 launch milestone.',
              };
            }
            if (confidence >= 40) {
              return {
                primaryMetricLabel: 'Risk-Adjusted ARR',
                primaryMetricValue: `$${ev}M`,
                secondaryMetricLabel: 'Discovery Action',
                secondaryMetricValue: 'Design Partner Pilot',
                status: 'caution',
                statusLabel: 'Validate WTP',
                insight:
                  'Sign 3–5 design partner LOIs or run a clickable prototype test before committing full squad capacity.',
              };
            }
            return {
              primaryMetricLabel: 'Risk-Adjusted ARR',
              primaryMetricValue: `$${ev}M`,
              secondaryMetricLabel: 'Discovery Action',
              secondaryMetricValue: 'Concierge / Smoke Test',
              status: 'critical',
              statusLabel: 'Unproven Thesis',
              insight:
                'Demand uncertainty is too high to write production code. Test customer urgency manually first.',
            };
          },
        },
        masteryQuestion: {
          prompt:
            'In a Senior PM interview, you are asked "Should Spotify launch a live ticket marketplace?" What is the strongest opening move?',
          options: [
            'Immediately list five UI screens for the ticket checkout flow',
            'Clarify strategic objective (margin expansion vs. artist lock-in), evaluate Spotify’s unfair demand advantage, and identify key risks like supply inventory',
            'Say yes because live events are popular with young users',
          ],
          correctIndex: 1,
          explanation:
            'Post-MBA PM interviews test strategic framing first—connecting company goals, distribution advantage, and ecosystem trade-offs before jumping into UI.',
        },
      },
      {
        id: 'pm-2',
        stageNumber: 2,
        title: 'SaaS Unit Economics: LTV, CAC & Net Dollar Retention',
        durationHours: 18,
        summary:
          'Speak the exact financial language of CFOs and VPs of Product by linking retention, gross margin, and expansion to durable enterprise growth.',
        keyTakeaways: [
          'LTV = (Monthly ARPA × Gross Margin %) / Monthly Logo Churn; benchmark healthy B2B SaaS at LTV:CAC ≥ 3× and Payback ≤ 12–18 months.',
          'Net Dollar Retention (NDR) above 115% creates compounding growth even if new logo acquisition pauses.',
          'Reducing monthly churn from 3% to 1.5% doubles customer lifetime value without spending an extra dollar on sales.',
        ],
        subSkills: [
          'Calculating LTV, CAC Payback, and SaaS Magic Number',
          'Diagnosing logo churn vs. net revenue retention',
          'Connecting product activation to payback speed',
        ],
        conceptModel: {
          title: 'CAC Payback & LTV:CAC Sensitivity Model',
          prompt:
            'Adjust monthly churn and customer acquisition cost (at $500/mo ARPA, 80% Gross Margin) to test SaaS unit health.',
          formulaLabel: 'Payback = CAC / (ARPA × GM) · LTV:CAC = LTV / CAC',
          sliders: [
            {
              id: 'churnPct',
              label: 'Monthly Logo Churn',
              min: 1.0,
              max: 8.0,
              step: 0.5,
              defaultValue: 2.5,
              unit: '%/mo',
            },
            {
              id: 'cac',
              label: 'Blended CAC',
              min: 1500,
              max: 12000,
              step: 500,
              defaultValue: 4500,
              unit: '$',
            },
          ],
          evaluate: ({ churnPct = 2.5, cac = 4500 }) => {
            const monthlyGm = 500 * 0.8; // $400
            const ltv = Math.round(monthlyGm / (churnPct / 100));
            const ratio = Number((ltv / cac).toFixed(1));
            const payback = Number((cac / monthlyGm).toFixed(1));
            if (ratio >= 3.0 && payback <= 14) {
              return {
                primaryMetricLabel: 'LTV : CAC Ratio',
                primaryMetricValue: `${ratio}×`,
                secondaryMetricLabel: 'CAC Payback',
                secondaryMetricValue: `${payback} mos`,
                status: 'nominal',
                statusLabel: 'Scalable Engine',
                insight:
                  'Strong capital efficiency—safe to accelerate go-to-market hiring and paid acquisition channels.',
              };
            }
            if (ratio >= 2.0 && payback <= 20) {
              return {
                primaryMetricLabel: 'LTV : CAC Ratio',
                primaryMetricValue: `${ratio}×`,
                secondaryMetricLabel: 'CAC Payback',
                secondaryMetricValue: `${payback} mos`,
                status: 'caution',
                statusLabel: 'Tight Efficiency',
                insight:
                  'Retention or acquisition cost needs tightening before scaling sales headcount aggressively.',
              };
            }
            return {
              primaryMetricLabel: 'LTV : CAC Ratio',
              primaryMetricValue: `${ratio}×`,
              secondaryMetricLabel: 'CAC Payback',
              secondaryMetricValue: `${payback} mos`,
              status: 'critical',
              statusLabel: 'Broken Unit Economics',
              insight:
                'Scaling spend here burns cash. Fix early churn or shift toward product-led acquisition before expanding paid channels.',
            };
          },
        },
        masteryQuestion: {
          prompt:
            'A B2B SaaS product has 90% Gross Revenue Retention (GRR) and 118% Net Dollar Retention (NDR). What does that tell an executive?',
          options: [
            '10% of existing ARR churned/contracted, but expansion upsells (+28%) more than offset churn to grow existing cohorts by 18%',
            'The company lost 118% of its customers last year',
            'Marketing spend exceeded total revenue',
          ],
          correctIndex: 0,
          explanation:
            'NDR = GRR + Expansion Revenue %. Strong expansion (seat growth, usage tiers) turns existing customers into a self-compounding growth engine.',
        },
      },
      {
        id: 'pm-3',
        stageNumber: 3,
        title: 'Pricing, Packaging & Monetization Architecture',
        durationHours: 16,
        summary:
          'Choose the right value metric (per seat, usage, or hybrid), fence enterprise tiers cleanly, and drive expansion without alienating small teams.',
        keyTakeaways: [
          'Align your pricing metric directly with how customers experience growing value (e.g., API calls, active seats, or GMV processed).',
          'Good–Better–Best packaging works when enterprise gates (SSO, audit logs, SLA) match natural willingness-to-pay jumps.',
          'Never hide core activation value behind a paywall too early if product-led growth depends on virality.',
        ],
        subSkills: [
          'Value-metric selection & tier fencing',
          'Modeling ARPU lift vs. conversion trade-offs',
          'Enterprise annual contract migration',
        ],
        conceptModel: {
          title: 'Tiered Packaging & Enterprise Upgrade Lift Model',
          prompt:
            'Test how introducing a $180/mo Enterprise tier with SSO & analytics shifts blended ARPU across 1,000 paying teams.',
          formulaLabel: 'Total MRR = (Core Teams × $75) + (Enterprise Teams × Tier Price)',
          sliders: [
            {
              id: 'upgradePct',
              label: 'Accounts Upgrading to Enterprise',
              min: 5,
              max: 45,
              step: 5,
              defaultValue: 20,
              unit: '%',
            },
            {
              id: 'entPrice',
              label: 'Enterprise Tier Monthly Price',
              min: 120,
              max: 350,
              step: 10,
              defaultValue: 200,
              unit: '$',
            },
          ],
          evaluate: ({ upgradePct = 20, entPrice = 200 }) => {
            const baseMrr = 1000 * 75;
            const entCount = Math.round(1000 * (upgradePct / 100));
            const newMrr = (1000 - entCount) * 75 + entCount * entPrice;
            const liftPct = Math.round(((newMrr - baseMrr) / baseMrr) * 100);
            const arpu = Math.round(newMrr / 1000);
            return {
              primaryMetricLabel: 'Blended ARPU',
              primaryMetricValue: `$${arpu}/mo`,
              secondaryMetricLabel: 'MRR Expansion',
              secondaryMetricValue: `+${liftPct}%`,
              status: liftPct >= 25 ? 'nominal' : 'caution',
              statusLabel: liftPct >= 25 ? 'High Expansion' : 'Modest Lift',
              insight: `Packaging enterprise compliance features adds +$${((newMrr - baseMrr) / 1000).toFixed(1)}k monthly recurring revenue with zero new acquisition cost.`,
            };
          },
        },
        masteryQuestion: {
          prompt:
            'Why is charging per-seat sometimes a weak pricing metric for an AI or workflow automation tool?',
          options: [
            'Because buyers dislike monthly invoices',
            'Because if automation makes 2 employees do the work of 10, seat counts shrink even as customer value increases—usage or outcome metrics align incentives better',
            'Because enterprise finance teams cannot approve seat licenses',
          ],
          correctIndex: 1,
          explanation:
            'When product value reduces human headcount required, seat-based pricing penalizes your own success; hybrid platform + usage tiers preserve upside.',
        },
      },
      {
        id: 'pm-4',
        stageNumber: 4,
        title: 'GTM Launches, Experimentation & Executive Alignment',
        durationHours: 18,
        summary:
          'Align engineering, sales, marketing, and finance around staged rollouts, guardrail metrics, and decisive post-launch reviews.',
        keyTakeaways: [
          'Pair every primary growth metric with a counter-metric (e.g., trial-to-paid conversion paired with 60-day refund/churn rate).',
          'Enable sales and customer success 3 weeks before GA with clear battlecards, pricing FAQs, and migration playbooks.',
          'Hold a scheduled Day-30 executive review to decide explicitly: scale, iterate, or sunset.',
        ],
        subSkills: [
          'North-star & guardrail metric tree design',
          'Cross-functional GTM launch readiness',
          'Executive steering & roadmap trade-off memos',
        ],
        conceptModel: {
          title: 'Launch Guardrail & Rollout Velocity Planner',
          prompt:
            'Balance initial rollout cohort percentage and enterprise enablement lead time to prevent support spikes.',
          formulaLabel: 'Support Load Risk = Exposed Accounts / Enablement Readiness',
          sliders: [
            {
              id: 'cohortPct',
              label: 'Week-1 Rollout Cohort',
              min: 5,
              max: 100,
              step: 5,
              defaultValue: 15,
              unit: '%',
            },
            {
              id: 'enableDays',
              label: 'Sales / CS Pre-Launch Lead Time',
              min: 0,
              max: 28,
              step: 2,
              defaultValue: 14,
              unit: 'days',
            },
          ],
          evaluate: ({ cohortPct = 15, enableDays = 14 }) => {
            if (cohortPct <= 25 && enableDays >= 10) {
              return {
                primaryMetricLabel: 'Launch Risk Tier',
                primaryMetricValue: 'Controlled',
                secondaryMetricLabel: 'Feedback Velocity',
                secondaryMetricValue: 'High Signal',
                status: 'nominal',
                statusLabel: 'Disciplined GTM',
                insight:
                  'Canary rollout plus trained field teams allow fast learning without overwhelming customer support.',
              };
            }
            if (enableDays < 7) {
              return {
                primaryMetricLabel: 'Launch Risk Tier',
                primaryMetricValue: 'High Friction',
                secondaryMetricLabel: 'Feedback Velocity',
                secondaryMetricValue: 'Noisy',
                status: 'critical',
                statusLabel: 'Unprepared Field',
                insight:
                  'Shipping before sales and support have playbooks causes stalled deals and avoidable escalations.',
              };
            }
            return {
              primaryMetricLabel: 'Launch Risk Tier',
              primaryMetricValue: 'Elevated',
              secondaryMetricLabel: 'Feedback Velocity',
              secondaryMetricValue: 'Broad Exposure',
              status: 'caution',
              statusLabel: 'Wide Initial Blast',
              insight:
                'Consider gating Week 1 to 10–20% of accounts so telemetry and billing edge cases are verified cleanly.',
            };
          },
        },
        masteryQuestion: {
          prompt:
            'An experiment simplifying free-trial signup boosts trial starts by +25%, while 30-day paid conversion drops by −18%. What should the PM recommend?',
          options: [
            'Ship immediately because top-of-funnel signups jumped 25%',
            'Hold rollout and segment by user intent—net paid conversions are roughly flat while support and compute costs rose',
            'Delete the analytics tracking script',
          ],
          correctIndex: 1,
          explanation:
            '1.25 × 0.82 = 1.025 (+2.5% net paid lift) at 25% higher onboarding load. Guardrail metrics reveal whether added volume is low-intent noise.',
        },
      },
    ],
  },
  {
    id: 'operations',
    title: 'General Management, LDP & Operations',
    shortTitle: 'General Mgmt',
    tagline:
      'Step into P&L ownership: optimize working capital, unblock operational bottlenecks, allocate capital for ROIC, and lead 90-day organizational turnarounds.',
    image: `${import.meta.env.BASE_URL}src/assets/images/track_mba_operations_1795532346467.jpg`,
    imageAlt:
      'General management studio desk with Q4 operating plan binder, process cards, and ceramic cup on pale oak',
    totalHours: 64,
    salaryBand: '$155k–$205k',
    levelRange: 'Post-MBA LDP / GM / BizOps Lead',
    coreTools: ['P&L Ownership', 'Working Capital (CCC)', 'Theory of Constraints', 'ROIC & CapEx', 'Change Leadership'],
    portfolioBrief: {
      title: '90-Day Business Unit Turnaround & Operating Plan',
      summary:
        'Build a comprehensive operating playbook for a $120M regional division facing margin erosion, inventory bloat, and cross-functional silos.',
      deliverables: [
        'Full divisional P&L bridge identifying top 3 EBITDA and working-capital levers',
        'Bottleneck capacity analysis & inventory turnover improvement plan',
        '30-60-90 day leadership cadence with KPI dashboard and owner accountability',
        'Capital allocation proposal ranking 5 operational investments by ROIC & payback',
      ],
    },
    recommendedSkills: [
      'P&L Management',
      'Operating Cadence & KPIs',
      'Working Capital Optimization',
      'Supply Chain & Throughput',
      'Capital Allocation (ROIC)',
      'Cross-Functional Execution',
      'Organizational Change',
      'Executive Communication',
    ],
    modules: [
      {
        id: 'ops-1',
        stageNumber: 1,
        title: 'Working Capital & Cash Conversion Cycle Mastery',
        durationHours: 16,
        summary:
          'Unlock trapped cash off the balance sheet by tightening Accounts Receivable (DSO), Inventory (DIO), and Vendor Terms (DPO).',
        keyTakeaways: [
          'Cash Conversion Cycle (CCC) = DIO + DSO − DPO; every day shaved off CCC directly releases operating cash.',
          'Profitable companies still run out of cash when rapid revenue growth traps working capital in inventory and slow receivables.',
          'Always verify whether extending supplier DPO forfeits lucrative early-payment discounts (e.g., 2/10 net 30 ≈ 36% annualized).',
        ],
        subSkills: [
          'Computing DIO, DSO, DPO, and Cash Conversion Cycle',
          'Quantifying cash unlocked per day reduced',
          'Balancing inventory buffers against stockout risk',
        ],
        conceptModel: {
          title: 'Cash Conversion Cycle & Cash Release Simulator',
          prompt:
            'Tune Days Inventory (DIO) and Days Sales Outstanding (DSO) on a $180M revenue / $110M COGS division (DPO fixed at 40 days).',
          formulaLabel: 'CCC = DIO + DSO − DPO (40 days)',
          sliders: [
            {
              id: 'dio',
              label: 'Days Inventory Outstanding (DIO)',
              min: 20,
              max: 95,
              step: 5,
              defaultValue: 65,
              unit: 'days',
            },
            {
              id: 'dso',
              label: 'Days Sales Outstanding (DSO)',
              min: 20,
              max: 80,
              step: 5,
              defaultValue: 55,
              unit: 'days',
            },
          ],
          evaluate: ({ dio = 65, dso = 55 }) => {
            const ccc = dio + dso - 40;
            const baselineWc = (65 / 365) * 110 + (55 / 365) * 180;
            const currentWc = (dio / 365) * 110 + (dso / 365) * 180;
            const cashFreedM = Number((baselineWc - currentWc).toFixed(1));
            if (ccc <= 55) {
              return {
                primaryMetricLabel: 'Cash Conversion Cycle',
                primaryMetricValue: `${ccc} days`,
                secondaryMetricLabel: 'Cash Freed vs. Base',
                secondaryMetricValue: `${cashFreedM >= 0 ? '+' : ''}$${cashFreedM}M`,
                status: 'nominal',
                statusLabel: 'Lean Cash Engine',
                insight:
                  'Tight collections and faster inventory turns release millions in non-dilutive cash to self-fund growth.',
              };
            }
            if (ccc <= 85) {
              return {
                primaryMetricLabel: 'Cash Conversion Cycle',
                primaryMetricValue: `${ccc} days`,
                secondaryMetricLabel: 'Cash Freed vs. Base',
                secondaryMetricValue: `${cashFreedM >= 0 ? '+' : ''}$${cashFreedM}M`,
                status: 'caution',
                statusLabel: 'Moderate Cash Drag',
                insight:
                  'Audit slow-moving SKUs and automate invoicing reminders to pull CCC below 55 days.',
              };
            }
            return {
              primaryMetricLabel: 'Cash Conversion Cycle',
              primaryMetricValue: `${ccc} days`,
              secondaryMetricLabel: 'Cash Freed vs. Base',
              secondaryMetricValue: `${cashFreedM >= 0 ? '+' : ''}$${cashFreedM}M`,
              status: 'critical',
              statusLabel: 'Heavy Capital Trap',
              insight:
                'Over three months of operating cash is locked in warehouses and unpaid invoices—liquidity is strained.',
            };
          },
        },
        masteryQuestion: {
          prompt:
            'A $365M revenue business reduces its Accounts Receivable collection time (DSO) from 55 days to 45 days. Roughly how much one-time cash is freed?',
          options: ['$1M', '$10M', '$45M'],
          correctIndex: 1,
          explanation:
            'At $365M annual revenue ($1M/day), pulling collections in by 10 days unlocks ~$10M directly into cash on hand.',
        },
      },
      {
        id: 'ops-2',
        stageNumber: 2,
        title: 'Bottleneck Throughput & Theory of Constraints',
        durationHours: 16,
        summary:
          'Diagnose end-to-end process capacity, eliminate the single binding constraint, and stop wasting CapEx on non-bottleneck stages.',
        keyTakeaways: [
          'System throughput equals the capacity of its slowest stage—speeding up non-bottlenecks only piles up work-in-process inventory.',
          'An hour lost at the bottleneck is an hour lost forever for the entire plant or service line.',
          'Elevate constraints first through low-cost scheduling/setup reduction before buying new equipment.',
        ],
        subSkills: [
          'Process mapping & utilization bottlenecks',
          'Little’s Law (WIP = Throughput × Cycle Time)',
          'OEE & shift-level capacity planning',
        ],
        conceptModel: {
          title: 'Multi-Stage Capacity & Bottleneck Explorer',
          prompt:
            'A 3-step fulfillment line has Picking (900/hr) and Shipping (850/hr). Tune QA Packing capacity and incoming order demand.',
          formulaLabel: 'Line Throughput = min(Demand, Picking 900, Packing, Shipping 850)',
          sliders: [
            {
              id: 'packingCap',
              label: 'Stage 2: QA Packing Capacity',
              min: 400,
              max: 1000,
              step: 50,
              defaultValue: 600,
              unit: 'ord/hr',
            },
            {
              id: 'demand',
              label: 'Peak Hourly Order Demand',
              min: 500,
              max: 950,
              step: 50,
              defaultValue: 800,
              unit: 'ord/hr',
            },
          ],
          evaluate: ({ packingCap = 600, demand = 800 }) => {
            const lineCap = Math.min(900, packingCap, 850);
            const throughput = Math.min(demand, lineCap);
            const backlog = Math.max(0, demand - lineCap);
            const bottleneck =
              packingCap <= 850 ? 'Stage 2: QA Packing' : 'Stage 3: Shipping (850/hr)';
            if (backlog === 0) {
              return {
                primaryMetricLabel: 'Fulfilled Throughput',
                primaryMetricValue: `${throughput} ord/hr`,
                secondaryMetricLabel: 'Binding Constraint',
                secondaryMetricValue: 'Demand-Bound',
                status: 'nominal',
                statusLabel: 'SLA Met',
                insight: `Current capacity (${lineCap}/hr) clears peak demand cleanly without accumulating warehouse backlog.`,
              };
            }
            return {
              primaryMetricLabel: 'Fulfilled Throughput',
              primaryMetricValue: `${throughput} ord/hr`,
              secondaryMetricLabel: 'Hourly Backlog Growth',
              secondaryMetricValue: `+${backlog} ord/hr`,
              status: backlog > 150 ? 'critical' : 'caution',
              statusLabel: bottleneck,
              insight: `Investing in Picking (already 900/hr) adds zero output. Cross-train staff onto ${bottleneck} to clear the ${backlog}/hr deficit.`,
            };
          },
        },
        masteryQuestion: {
          prompt:
            'In a 4-stage clinic workflow where Intake = 20/hr, Triage = 12/hr, Exam = 18/hr, and Billing = 25/hr, an ops team speeds up Intake to 30/hr. What happens to patients served per hour?',
          options: [
            'Patients served rises to 30/hr',
            'Patients served stays stuck at 12/hr while the waiting room before Triage gets more crowded',
            'Billing becomes the new bottleneck',
          ],
          correctIndex: 1,
          explanation:
            'Throughput is strictly governed by the Triage bottleneck (12/hr); accelerating an upstream stage only inflates waiting-room WIP.',
        },
      },
      {
        id: 'ops-3',
        stageNumber: 3,
        title: 'Capital Allocation, ROIC & Value Creation',
        durationHours: 16,
        summary:
          'Deploy scarce corporate capital where Return on Invested Capital (ROIC) exceeds WACC, balancing maintenance CapEx against high-IRR growth projects.',
        keyTakeaways: [
          'Growth only creates shareholder value when ROIC > WACC; growing a business below its cost of capital destroys value.',
          'Rank internal proposals by Risk-Adjusted NPV and Payback Period rather than departmental politics.',
          'Always audit post-investment actuals 12 months later to eliminate chronic forecasting optimism.',
        ],
        subSkills: [
          'ROIC vs. WACC economic spread analysis',
          'CapEx approval memos & sensitivity cases',
          'Build vs. Buy vs. Partner evaluations',
        ],
        conceptModel: {
          title: 'ROIC vs. WACC Economic Value Added (EVA) Model',
          prompt:
            'Inspect how invested capital return spread drives annual Economic Value Added on a $100M business unit.',
          formulaLabel: 'Annual EVA = Invested Capital ($100M) × (ROIC − WACC)',
          sliders: [
            {
              id: 'roic',
              label: 'Division ROIC',
              min: 4,
              max: 26,
              step: 1,
              defaultValue: 15,
              unit: '%',
            },
            {
              id: 'wacc',
              label: 'Corporate Cost of Capital (WACC)',
              min: 6,
              max: 15,
              step: 1,
              defaultValue: 10,
              unit: '%',
            },
          ],
          evaluate: ({ roic = 15, wacc = 10 }) => {
            const spread = roic - wacc;
            const evaM = spread; // on $100M capital base
            if (spread >= 4) {
              return {
                primaryMetricLabel: 'Economic Spread',
                primaryMetricValue: `+${spread}%`,
                secondaryMetricLabel: 'Annual EVA ($100M base)',
                secondaryMetricValue: `+$${evaM}M`,
                status: 'nominal',
                statusLabel: 'Value Creator',
                insight:
                  'Strong positive spread—reinvesting earnings into this unit compounds intrinsic enterprise value.',
              };
            }
            if (spread >= 0) {
              return {
                primaryMetricLabel: 'Economic Spread',
                primaryMetricValue: `+${spread}%`,
                secondaryMetricLabel: 'Annual EVA ($100M base)',
                secondaryMetricValue: `+$${evaM}M`,
                status: 'caution',
                statusLabel: 'Thin Margin of Safety',
                insight:
                  'Barely clears cost of capital. Focus on margin expansion and capital efficiency before funding expansion.',
              };
            }
            return {
              primaryMetricLabel: 'Economic Spread',
              primaryMetricValue: `${spread}%`,
              secondaryMetricLabel: 'Annual EVA ($100M base)',
              secondaryMetricValue: `-$${Math.abs(evaM)}M`,
              status: 'critical',
              statusLabel: 'Value Destruction',
              insight:
                'Every new dollar invested destroys shareholder value. Halt expansion CapEx and restructure pricing/asset base.',
            };
          },
        },
        masteryQuestion: {
          prompt:
            'Division X grows revenue 20% annually with a 7% ROIC while the company’s WACC is 10%. Should the CEO allocate more growth capital to Division X?',
          options: [
            'Yes—20% top-line growth always increases enterprise value',
            'No—growing an asset earning below its cost of capital destroys value until ROIC exceeds WACC',
            'Yes—as long as gross headcount increases',
          ],
          correctIndex: 1,
          explanation:
            'Revenue growth with a negative ROIC − WACC spread accelerates value destruction; fix unit returns before scaling capital.',
        },
      },
      {
        id: 'ops-4',
        stageNumber: 4,
        title: '90-Day Leadership Transitions & Operating Cadence',
        durationHours: 16,
        summary:
          'Diagnose a new organization rapidly, earn trust across tenured managers, install a crisp weekly KPI rhythm, and deliver early wins.',
        keyTakeaways: [
          'Days 1–30: Listen deeply, visit frontline customers/operations, and audit the real P&L before announcing restructurings.',
          'Days 31–60: Align leadership on 3–5 non-negotiable metrics and unlock one visible, high-credibility early win.',
          'Days 61–90: Institutionalize weekly operating reviews (WBRs) with clear single-threaded owners and escalation triggers.',
        ],
        subSkills: [
          'Designing Weekly Business Reviews (WBRs)',
          'Managing up to C-suite & boards without surprises',
          'Leading cross-functional change without formal authority',
        ],
        conceptModel: {
          title: 'Operating Cadence & Strategic Focus Audit',
          prompt:
            'Evaluate how quarterly priority count and single-threaded ownership affect execution completion rates across teams.',
          formulaLabel: 'Execution Velocity = Focused Priorities × Clear Single Ownership',
          sliders: [
            {
              id: 'priorities',
              label: 'Concurrent Quarterly Initiatives',
              min: 2,
              max: 14,
              step: 1,
              defaultValue: 4,
              unit: 'bets',
            },
            {
              id: 'ownerPct',
              label: 'Bets With 1 Accountable Owner',
              min: 20,
              max: 100,
              step: 10,
              defaultValue: 90,
              unit: '%',
            },
          ],
          evaluate: ({ priorities = 4, ownerPct = 90 }) => {
            const completionPct = Math.min(
              96,
              Math.max(
                18,
                Math.round(ownerPct * 0.95 - Math.max(0, priorities - 4) * 7.5)
              )
            );
            if (priorities <= 5 && ownerPct >= 80) {
              return {
                primaryMetricLabel: 'Expected On-Time Delivery',
                primaryMetricValue: `${completionPct}%`,
                secondaryMetricLabel: 'Org Focus State',
                secondaryMetricValue: 'High Alignment',
                status: 'nominal',
                statusLabel: 'Crisp Cadence',
                insight:
                  'Fewer than 5 clear priorities with single-threaded owners keep teams executing decisively every week.',
              };
            }
            if (priorities > 8) {
              return {
                primaryMetricLabel: 'Expected On-Time Delivery',
                primaryMetricValue: `${completionPct}%`,
                secondaryMetricLabel: 'Org Focus State',
                secondaryMetricValue: 'Context Thrash',
                status: 'critical',
                statusLabel: 'Over-Committed',
                insight:
                  'When everything is Priority 1, nothing ships. Cut or defer half the list publicly so teams can finish.',
              };
            }
            return {
              primaryMetricLabel: 'Expected On-Time Delivery',
              primaryMetricValue: `${completionPct}%`,
              secondaryMetricLabel: 'Org Focus State',
              secondaryMetricValue: 'Shared Ambiguity',
              status: 'caution',
              statusLabel: 'Tighten Accountability',
              insight:
                'Assign exactly one DRI (Directly Responsible Individual) per initiative to eliminate committee drift.',
            };
          },
        },
        masteryQuestion: {
          prompt:
            'In your first 30 days leading a struggling regional business unit after your MBA, what builds credibility fastest with veteran managers?',
          options: [
            'Presenting a 60-slide reorganization plan on Day 5 before visiting sites',
            'Shadowing frontline teams, listening to bottlenecks, sharing transparent data, and removing one frustrating operational roadblock quickly',
            'Replacing all existing KPIs with complex academic ratios immediately',
          ],
          correctIndex: 1,
          explanation:
            'Earning trust through frontline curiosity and removing a concrete bottleneck builds momentum for larger structural changes in Days 31–90.',
        },
      },
    ],
  },
];

export interface DiagnosticOption {
  label: string;
  description: string;
  weights: Record<TrackId, number>;
}

export interface DiagnosticQuestion {
  id: string;
  step: number;
  question: string;
  options: DiagnosticOption[];
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'q1',
    step: 1,
    question: 'Which Post-MBA boardroom challenge energizes you most?',
    options: [
      {
        label: 'Diagnosing why a Fortune 500’s profit dropped & charting a turnaround',
        description: 'Structured MECE problem-solving across diverse industries and executive teams.',
        weights: { consulting: 3, finance: 1, product: 1, operations: 1 },
      },
      {
        label: 'Valuing a $1B acquisition, structuring debt, and closing a live deal',
        description: 'Rigorous financial modeling, capital markets, and transaction advisory.',
        weights: { consulting: 1, finance: 3, product: 0, operations: 1 },
      },
      {
        label: 'Deciding what software product to build next and scaling SaaS ARR',
        description: 'Bridging customer insight, engineering velocity, and commercial monetization.',
        weights: { consulting: 1, finance: 0, product: 3, operations: 1 },
      },
      {
        label: 'Owning a full business unit P&L and leading operational execution',
        description: 'Long-term accountability for throughput, working capital, and people leadership.',
        weights: { consulting: 1, finance: 1, product: 1, operations: 3 },
      },
    ],
  },
  {
    id: 'q2',
    step: 2,
    question: 'Which career deliverable would you feel proudest presenting to a CEO?',
    options: [
      {
        label: 'A crisp 8-slide market entry & profitability strategy deck',
        description: 'Answer-first executive synthesis backed by clean commercial data.',
        weights: { consulting: 3, finance: 0, product: 1, operations: 1 },
      },
      {
        label: 'An institutional DCF, Comps & LBO valuation memo',
        description: 'Defensible valuation range, capital structure, and accretion math.',
        weights: { consulting: 0, finance: 3, product: 0, operations: 1 },
      },
      {
        label: 'A B2B product roadmap, pricing tier overhaul & GTM plan',
        description: 'Tying user retention experiments directly to LTV:CAC and expansion.',
        weights: { consulting: 1, finance: 0, product: 3, operations: 0 },
      },
      {
        label: 'A 90-day divisional turnaround & working capital operating plan',
        description: 'Weekly KPI cadence, bottleneck fixes, and ROIC-ranked CapEx bets.',
        weights: { consulting: 1, finance: 1, product: 0, operations: 3 },
      },
    ],
  },
  {
    id: 'q3',
    step: 3,
    question: 'What kind of career rhythm and scope fits your next 3–5 years?',
    options: [
      {
        label: 'High-variety executive projects with rapid upward trajectory & exit options',
        description: 'Multiple industries per year, steep communication & strategy toolkit.',
        weights: { consulting: 3, finance: 1, product: 0, operations: 1 },
      },
      {
        label: 'High-stakes transactions, capital allocation, and top-quartile cash comp',
        description: 'Deep finance mastery opening doors to PE, Corp Dev, and CFO tracks.',
        weights: { consulting: 0, finance: 3, product: 0, operations: 1 },
      },
      {
        label: 'Building scalable tech products with high equity upside and cross-functional reach',
        description: 'Partnering directly with engineering, design, and GTM leaders.',
        weights: { consulting: 0, finance: 0, product: 3, operations: 1 },
      },
      {
        label: 'Stepping onto a fast-track GM / VP path running real teams and budgets',
        description: 'Rotational LDPs, BizOps, or Chief-of-Staff roles leading to P&L ownership.',
        weights: { consulting: 1, finance: 0, product: 1, operations: 3 },
      },
    ],
  },
  {
    id: 'q4',
    step: 4,
    question: 'How many focused recruiting & prep hours per week can you commit?',
    options: [
      {
        label: '6 hours / week — Balancing full-time role or MBA coursework',
        description: 'Structured evening drills and weekend case/model reviews.',
        weights: { consulting: 0, finance: 0, product: 0, operations: 0 },
      },
      {
        label: '10 hours / week — Standard Post-MBA recruiting cadence',
        description: 'Consistent mix of technical mastery, mock cases, and networking.',
        weights: { consulting: 0, finance: 0, product: 0, operations: 0 },
      },
      {
        label: '15 hours / week — Peak recruiting sprint',
        description: 'Daily case math, financial modeling drills, and PEI rehearsals.',
        weights: { consulting: 0, finance: 0, product: 0, operations: 0 },
      },
      {
        label: '20 hours / week — Intensive full-time job search',
        description: 'Immersive prep for imminent superdays and final-round panels.',
        weights: { consulting: 0, finance: 0, product: 0, operations: 0 },
      },
    ],
  },
];

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'mba-pei-1',
    trackId: 'general',
    category: 'McKinsey PEI · Personal Impact',
    prompt:
      'Tell me about a time you persuaded a skeptical senior leader or hostile stakeholder to change their mind on a high-stakes decision.',
    interviewerIntent:
      'Probes executive presence, empathy for opposing incentives, data-backed persuasion, and resilience under resistance.',
    sampleOutline: {
      situation:
        'During my pre-MBA strategy role, our VP of Sales opposed retiring legacy custom discounts that were eroding regional gross margins by 4 points.',
      task: 'Align commercial leadership on a standardized pricing tier before the annual Q1 renewal cycle without hurting rep morale or quota attainment.',
      action:
        'I ran account-level margin cohorts showing 70% of deep discounts went to low-churn customers who did not need them, co-designed a margin-weighted commission accelerator with two top reps, and piloted it in one territory.',
      result:
        'Pilot gross margin expanded 340 bps while rep commissions rose 9%, convincing the VP to roll the new pricing architecture across all six regions ($4.2M annualized EBITDA lift).',
    },
  },
  {
    id: 'mba-pei-2',
    trackId: 'general',
    category: 'Executive Leadership · Ambiguity',
    prompt:
      'Walk me through a time you led a cross-functional initiative with no formal authority and had to navigate competing team priorities.',
    interviewerIntent:
      'Evaluates coalition building, structured accountability, and calm leadership when you cannot rely on title alone.',
    sampleOutline: {
      situation:
        'Our enterprise onboarding cycle had stretched from 21 to 48 days because Sales, Implementation, and Legal operated on disconnected handoffs.',
      task: 'Cut onboarding cycle time in half ahead of a major enterprise product launch without adding headcount.',
      action:
        'I mapped end-to-end cycle delays with frontline leads from all three groups, pinpointed a 16-day legal redline bottleneck, introduced pre-approved fallback clauses, and instituted a 15-minute weekly escalation huddle.',
      result:
        'Reduced median onboarding from 48 to 19 days within one quarter, accelerating $3.1M in recognized ARR and raising post-onboarding NPS by 14 points.',
    },
  },
  {
    id: 'mba-con-1',
    trackId: 'consulting',
    category: 'Consulting Case · Profitability',
    prompt:
      'A national specialty coffee chain grew store count 15% over two years, yet total EBITDA fell 12%. How would you structure your diagnosis in 2 minutes?',
    interviewerIntent:
      'Tests crisp MECE structuring, ability to separate same-store vs. new-store economics, and hypothesis-driven prioritization.',
    sampleOutline: {
      situation:
        'Client is a national specialty coffee chain experiencing a 12% EBITDA decline despite 15% footprint expansion.',
      task: 'Isolate whether margin compression stems from cannibalized/underperforming new stores or structural unit cost inflation across legacy stores.',
      action:
        'Structure three MECE pillars: (1) Revenue per store split by legacy vs. new cohorts (traffic, ticket size, product mix), (2) Store-level Cost Structure (green bean COGS, barista wage inflation, lease rates), and (3) Corporate SG&A / Cannibalization overlap.',
      result:
        'Prioritize cohort revenue-vs-margin comparison first: if legacy margins held flat, pause site expansion and audit site-selection criteria; if legacy stores fell too, target pricing mix and labor scheduling.',
    },
  },
  {
    id: 'mba-con-2',
    trackId: 'consulting',
    category: 'Consulting PEI · Drive & Failure',
    prompt:
      'Tell me about a time an ambitious business initiative you owned fell short of its target—what did you diagnose and change?',
    interviewerIntent:
      'Checks intellectual honesty, lack of defensiveness, analytical post-mortem rigor, and measurable recovery.',
    sampleOutline: {
      situation:
        'I launched a regional B2B channel partner program targeting $2M in Year-1 pipeline, but hit only $420k by Month 6.',
      task: 'Determine whether to shut down the channel or pivot the operating model before Q4 budget lock.',
      action:
        'I interviewed 11 inactive partners and discovered our 6-week certification process was too heavy for small integrators. I streamlined onboarding to 48 hours and concentrated co-selling support on 8 high-fit vertical partners.',
      result:
        'Partner-sourced bookings rebounded to $1.65M over the next two quarters at 38% lower CAC than direct outbound sales.',
    },
  },
  {
    id: 'mba-fin-1',
    trackId: 'finance',
    category: 'IB Technical · Deal Walk-Through',
    prompt:
      'Walk me through a recent M&A transaction or valuation you followed closely—was the purchase price justified and how did the math work?',
    interviewerIntent:
      'Assesses commercial markets passion, mastery of valuation multiples, synergy skepticism, and concise pitch delivery.',
    sampleOutline: {
      situation:
        'Strategic industrial software acquirer bought a vertical supply-chain SaaS peer for $1.4B (~11× forward revenue, 28% premium to 30-day VWAP).',
      task: 'Evaluate whether the premium was justified on standalone DCF and achievable synergy math.',
      action:
        'Benchmarked target’s 118% NDR and 24% Rule-of-40 profile against comps (trading at 9×), modeled $35M in near-term G&A/cloud cost synergies (capitalized at ~14× EBITDA), and checked all-cash debt capacity at 3.2× pro-forma leverage.',
      result:
        'Concluded price was fair-to-full: cost synergies cover ~60% of the premium, making the deal Year-2 EPS accretive provided cross-sell churn stays below 5%.',
    },
  },
  {
    id: 'mba-fin-2',
    trackId: 'finance',
    category: 'IB Technical · Valuation & LBO',
    prompt:
      'Why might a strategic acquirer generally be able to outbid a financial sponsor (PE firm) for the same target—and when can PE win anyway?',
    interviewerIntent:
      'Tests deep corporate finance intuition around cost of capital, synergies, leverage, and LBO return constraints.',
    sampleOutline: {
      situation:
        'Competitive sell-side auction with both strategic corporate buyers and institutional private equity funds.',
      task: 'Explain valuation ceiling differences clearly and concisely to an MD.',
      action:
        'Contrast two levers: Strategics can pay for permanent cost/revenue synergies and have a lower blended cost of capital (WACC ~8–10% vs. PE’s 20%+ equity IRR hurdle). However, PE can outbid when cheap credit allows high leverage, when strategics face antitrust/dilution constraints, or when PE owns an existing platform company with its own roll-up synergies.',
      result:
        'Delivered a crisp 90-second synthesis linking valuation mechanics directly to real auction dynamics.',
    },
  },
  {
    id: 'mba-pm-1',
    trackId: 'product',
    category: 'Tech PM · Product Strategy',
    prompt:
      'You are the Post-MBA PM for a B2B workflow SaaS tool whose self-serve growth is slowing. How would you evaluate moving upmarket into Enterprise?',
    interviewerIntent:
      'Tests commercial strategy, willingness-to-pay analysis, engineering trade-offs, and GTM alignment.',
    sampleOutline: {
      situation:
        'Self-serve SMB tier ($40/mo) is saturating with 4% monthly churn, while inbound mid-market inquiries are rising.',
      task: 'Build a structured recommendation on whether and how to sequence an Enterprise tier over the next two quarters.',
      action:
        'Quantify ACV uplift ($25k+ annual contracts) vs. sales-assisted CAC payback, interview 15 organic power teams inside large companies to isolate non-negotiable blockers (SSO, RBAC, SOC-2), and propose a bottom-up PLG-to-Enterprise land-and-expand motion rather than building bespoke features.',
      result:
        'Defined a clear 2-quarter MVP roadmap with an explicit $1.5M Year-1 expansion ARR target and 14-month CAC payback guardrail.',
    },
  },
  {
    id: 'mba-pm-2',
    trackId: 'product',
    category: 'Tech PM · Analytical Execution',
    prompt:
      'Tell me about a time you used quantitative customer data to kill a popular internal feature idea or pivot a roadmap.',
    interviewerIntent:
      'Looks for analytical rigor, courage with senior stakeholders, and focus on measurable business outcomes.',
    sampleOutline: {
      situation:
        'Leadership wanted a full quarter spent building customizable executive dashboards requested by two vocal accounts.',
      task: 'Evaluate true ROI against competing onboarding improvements before locking Q3 engineering capacity.',
      action:
        'Pulled cohort SQL usage showing only 6% of active accounts exported reports while 42% of new signups stalled on data import during Week 1. Modeled retention ARR impact of both bets side-by-side.',
      result:
        'Aligned leadership to ship lightweight CSV templates in 1 week and dedicate the sprint to fixing data import—lifting Day-14 activation by 12 percentage points.',
    },
  },
  {
    id: 'mba-ops-1',
    trackId: 'operations',
    category: 'GM / LDP · P&L Turnaround',
    prompt:
      'You inherit a $90M regional division that missed EBITDA targets for three straight quarters. Walk me through your 30-60-90 day plan.',
    interviewerIntent:
      'Assesses practical operating judgment, financial diagnostic speed, people leadership, and disciplined prioritization.',
    sampleOutline: {
      situation:
        'Inherited an underperforming regional P&L with declining margins, rising inventory days, and low morale.',
      task: 'Stabilize cash flow and restore predictable quarterly EBITDA performance without alienating key frontline operators.',
      action:
        'Days 1–30: Decompose P&L by customer/SKU margin, shadow frontline ops, and interview top 10 accounts. Days 31–60: Cut bottom-decile negative-margin SKUs, tighten DSO collections, and solve the #1 fulfillment bottleneck for an early win. Days 61–90: Install a Weekly Business Review with 5 clear KPIs and single-threaded owners.',
      result:
        'Structured plan targets +250 bps EBITDA recovery and $4M working-capital cash release within two quarters.',
    },
  },
  {
    id: 'mba-ops-2',
    trackId: 'operations',
    category: 'GM / LDP · Tough Trade-Off',
    prompt:
      'Describe a time you had to make an unpopular operational trade-off—such as cutting a budget, sunsetting a product line, or restructuring a workflow.',
    interviewerIntent:
      'Checks emotional maturity, fairness, transparent communication, and ability to execute hard calls cleanly.',
    sampleOutline: {
      situation:
        'Rising freight costs pushed our next-day free shipping tier for sub-$50 orders into negative contribution margin.',
      task: 'Restore unit profitability without triggering a wave of core customer churn.',
      action:
        'Analyzed order elasticity by customer LTV segment, introduced a $65 free-shipping threshold while preserving free expedited shipping for annual loyalty members, and equipped customer support with proactive scripts two weeks early.',
      result:
        'Average order value rose 14%, fulfillment cost per order fell 19%, and 90-day repeat purchase rate stayed within 0.6% of baseline.',
    },
  },
];

export const INTERVIEW_RUBRIC = [
  'Opened with crisp executive context (Situation + Stakes) in under 20 seconds',
  'Demonstrated clear personal ("I") leadership, analytical rigor, and judgment',
  'Highlighted a real commercial constraint, stakeholder tension, or financial trade-off',
  'Closed with quantified business impact ($, bps, %, or cycle-time reduction)',
  'Maintained calm, concise boardroom pacing within the time cap',
];

export const STRONG_ACTION_VERBS = [
  'Spearheaded',
  'Structured',
  'Negotiated',
  'Modeled',
  'Orchestrated',
  'Scaled',
  'Captured',
  'Turned around',
  'Diligenced',
  'Redesigned',
  'Accelerated',
  'Unlocked',
];

export interface BulletPreset {
  weak: string;
  verb: string;
  what: string;
  metric: string;
  outcome: string;
}

export const BULLET_TRANSFORM_PRESETS: BulletPreset[] = [
  {
    weak: 'Helped the client team look at pricing and cost reduction.',
    verb: 'Structured',
    what: 'a regional pricing architecture and SKU rationalization across a $140M B2B distributor',
    metric: 'expanding EBITDA margin by 280 bps ($3.9M annualized)',
    outcome: 'approved unanimously by the executive steering committee',
  },
  {
    weak: 'Built financial models for potential acquisitions during summer internship.',
    verb: 'Modeled',
    what: 'linked 3-statement, DCF, and LBO valuations for a $420M healthcare tech buy-side mandate',
    metric: 'identifying $18M in actionable Year-2 cost synergies',
    outcome: 'that anchored the final $13.5× EBITDA winning bid',
  },
  {
    weak: 'Worked on SaaS pricing tiers and enterprise customer interviews.',
    verb: 'Spearheaded',
    what: 'a Good–Better–Best B2B packaging overhaul grounded in 28 enterprise WTP interviews',
    metric: 'lifting blended ARPU by 24% and Net Dollar Retention to 118%',
    outcome: 'within two quarters of general availability',
  },
  {
    weak: 'Managed warehouse operations and tried to reduce inventory delays.',
    verb: 'Unlocked',
    what: '$6.4M in trapped working capital across 4 regional distribution hubs',
    metric: 'cutting Days Inventory Outstanding from 72 to 49 days',
    outcome: 'while improving on-time-in-full delivery from 89% to 96.5%',
  },
];

export const DEFAULT_RESUME_DATA: ResumeData = {
  fullName: 'Maya Patel, MBA',
  targetRole: 'Management Consultant / Strategy & Operations Lead',
  location: 'New York, NY · Open to Relocation',
  email: 'maya.patel.mba@example.com',
  portfolioUrl: 'linkedin.com/in/mayapatel-mba',
  summary:
    'Post-MBA strategist and P&L operator with 5+ years leading commercial turnarounds, pricing transformations, and cross-functional launches across SaaS and industrial services. Track record of $12M+ quantified EBITDA and revenue impact.',
  skills: [
    'Corporate Strategy',
    'Financial Modeling & DCF',
    'P&L Turnaround',
    'Pricing Optimization',
    'SaaS Unit Economics',
    'Executive Storytelling',
  ],
  experiences: [
    {
      id: 'exp-1',
      role: 'MBA Strategy & Operations Summer Associate',
      organization: 'Vanguard Meridian Advisory',
      period: 'Jun 2026 – Aug 2026',
      bullets: [
        'Structured a go-to-market turnaround for a $180M B2B logistics client, identifying $6.2M in annualized EBITDA upside through tiered pricing and route consolidation.',
        'Built an executive board pack and 18-month implementation roadmap adopted by the CEO and 4 regional VPs.',
      ],
    },
    {
      id: 'exp-2',
      role: 'Senior Commercial Operations Manager',
      organization: 'Apex Cloud Systems',
      period: 'Jul 2021 – Jul 2025',
      bullets: [
        'Spearheaded an enterprise packaging and renewal playbook across 320 accounts, expanding Net Dollar Retention from 104% to 117% ($4.8M incremental ARR).',
        'Unlocked $3.4M in working capital by redesigning enterprise billing workflows and cutting Days Sales Outstanding from 64 to 42 days.',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'National MBA Strategy & Valuation Case Competition — 1st Place',
      context: 'DCF Valuation · M&A Diligence · Board Pitch',
      summary:
        'Led a 4-person MBA team evaluating a $650M cross-border industrial software acquisition; delivered linked LBO/DCF valuation and synergy integration plan to Managing Director judges.',
    },
  ],
};
