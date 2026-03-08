import{_ as a,o as n,c as e,ag as i}from"./chunks/framework.BYehg5q7.js";const k=JSON.parse('{"title":"Data Pipeline","description":"","frontmatter":{},"headers":[],"relativePath":"contributor/data-pipeline.md","filePath":"contributor/data-pipeline.md","lastUpdated":1772787054000}'),p={name:"contributor/data-pipeline.md"};function t(l,s,r,d,h,o){return n(),e("div",null,[...s[0]||(s[0]=[i(`<h1 id="data-pipeline" tabindex="-1">Data Pipeline <a class="header-anchor" href="#data-pipeline" aria-label="Permalink to &quot;Data Pipeline&quot;">​</a></h1><p><code>getActiveData()</code> in <code>js/data.js</code> is the central data pipeline. Every view — dashboard, category charts, compare, correlations, glossary, AI context — calls it to get processed data. It is a pure function with no side effects; it reads from <code>state</code> and returns a fresh <code>data</code> object each time.</p><h2 id="pipeline-flowchart" tabindex="-1">Pipeline flowchart <a class="header-anchor" href="#pipeline-flowchart" aria-label="Permalink to &quot;Pipeline flowchart&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>                      ┌──────────────────────┐</span></span>
<span class="line"><span>                      │   getActiveData()     │</span></span>
<span class="line"><span>                      └──────────┬───────────┘</span></span>
<span class="line"><span>                                 │</span></span>
<span class="line"><span>                                 ▼</span></span>
<span class="line"><span>                  Deep-clone MARKER_SCHEMA</span></span>
<span class="line"><span>                  into data.categories</span></span>
<span class="line"><span>                                 │</span></span>
<span class="line"><span>                                 ▼</span></span>
<span class="line"><span>                  Merge custom markers</span></span>
<span class="line"><span>                  from importedData.customMarkers</span></span>
<span class="line"><span>                                 │</span></span>
<span class="line"><span>                                 ▼</span></span>
<span class="line"><span>                  Apply sex-specific ranges</span></span>
<span class="line"><span>                  (replace refMin/refMax with _f if female)</span></span>
<span class="line"><span>                                 │</span></span>
<span class="line"><span>                                 ▼</span></span>
<span class="line"><span>                  Merge OPTIMAL_RANGES</span></span>
<span class="line"><span>                  into marker objects</span></span>
<span class="line"><span>                                 │</span></span>
<span class="line"><span>                                 ▼</span></span>
<span class="line"><span>                  Apply refOverrides</span></span>
<span class="line"><span>                  (ref + optimal range overrides per marker)</span></span>
<span class="line"><span>                                 │</span></span>
<span class="line"><span>                                 ▼</span></span>
<span class="line"><span>                  Collect dates from entries</span></span>
<span class="line"><span>                  (excluding singlePoint categories)</span></span>
<span class="line"><span>                                 │</span></span>
<span class="line"><span>                                 ▼</span></span>
<span class="line"><span>                  Build sorted data.dates[]</span></span>
<span class="line"><span>                  and data.dateLabels[]</span></span>
<span class="line"><span>                                 │</span></span>
<span class="line"><span>                                 ▼</span></span>
<span class="line"><span>                  Populate marker.values[]</span></span>
<span class="line"><span>                  aligned with dates, null = no data</span></span>
<span class="line"><span>                                 │</span></span>
<span class="line"><span>                                 ▼</span></span>
<span class="line"><span>                        ◇ singlePoint? ◇</span></span>
<span class="line"><span>                       ╱               ╲</span></span>
<span class="line"><span>                     yes                no</span></span>
<span class="line"><span>                      │                  │</span></span>
<span class="line"><span>                      ▼                  │</span></span>
<span class="line"><span>              Set cat.singleDate         │</span></span>
<span class="line"><span>              marker.singlePoint = true  │</span></span>
<span class="line"><span>                      │                  │</span></span>
<span class="line"><span>                      └───────┬──────────┘</span></span>
<span class="line"><span>                              │</span></span>
<span class="line"><span>                              ▼</span></span>
<span class="line"><span>                  Compute cycle phase labels</span></span>
<span class="line"><span>                  (female profiles with period data)</span></span>
<span class="line"><span>                              │</span></span>
<span class="line"><span>                              ▼</span></span>
<span class="line"><span>                  Compute phase-specific ref ranges</span></span>
<span class="line"><span>                  (estradiol and progesterone)</span></span>
<span class="line"><span>                              │</span></span>
<span class="line"><span>                              ▼</span></span>
<span class="line"><span>                  Calculate ratios</span></span>
<span class="line"><span>                  TG/HDL, LDL/HDL, ApoB/ApoAI,</span></span>
<span class="line"><span>                  NLR, PLR, De Ritis, Cu/Zn</span></span>
<span class="line"><span>                              │</span></span>
<span class="line"><span>                              ▼</span></span>
<span class="line"><span>                  Calculate Free Water Deficit</span></span>
<span class="line"><span>                  TBW × (Na / 140 − 1)</span></span>
<span class="line"><span>                              │</span></span>
<span class="line"><span>                              ▼</span></span>
<span class="line"><span>                  Calculate PhenoAge</span></span>
<span class="line"><span>                  Levine 2018, 9 biomarkers + DOB</span></span>
<span class="line"><span>                              │</span></span>
<span class="line"><span>                              ▼</span></span>
<span class="line"><span>                      ◇ US units? ◇</span></span>
<span class="line"><span>                     ╱              ╲</span></span>
<span class="line"><span>                   yes               no</span></span>
<span class="line"><span>                    │                 │</span></span>
<span class="line"><span>                    ▼                 │</span></span>
<span class="line"><span>            Apply unit conversions    │</span></span>
<span class="line"><span>            from UNIT_CONVERSIONS     │</span></span>
<span class="line"><span>                    │                 │</span></span>
<span class="line"><span>                    └────────┬────────┘</span></span>
<span class="line"><span>                             │</span></span>
<span class="line"><span>                             ▼</span></span>
<span class="line"><span>                  ┌──────────────────────┐</span></span>
<span class="line"><span>                  │     Return data       │</span></span>
<span class="line"><span>                  └──────────────────────┘</span></span></code></pre></div><p>The caller is responsible for applying date range filtering after receiving <code>data</code>:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> data</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> getActiveData</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">filterDatesByRange</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(data);   </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// mutates data.dates, data.dateLabels, marker.values in-place</span></span></code></pre></div><h2 id="marker-key-convention" tabindex="-1">Marker key convention <a class="header-anchor" href="#marker-key-convention" aria-label="Permalink to &quot;Marker key convention&quot;">​</a></h2><p>Markers are always referenced as <code>&quot;category.markerKey&quot;</code>:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>biochemistry.glucose</span></span>
<span class="line"><span>hormones.testosterone</span></span>
<span class="line"><span>lipids.triglycerides</span></span>
<span class="line"><span>hematology.wbc</span></span></code></pre></div><p>This format is used in:</p><ul><li><code>UNIT_CONVERSIONS</code> keys</li><li><code>OPTIMAL_RANGES</code> keys</li><li><code>PHASE_RANGES</code> keys</li><li><code>importedData.entries[].markers</code> — each entry stores its values keyed this way</li><li><code>importedData.customMarkers</code> — custom marker definitions</li><li>AI prompt references in <code>buildMarkerReference()</code></li></ul><h2 id="entry-storage-format" tabindex="-1">Entry storage format <a class="header-anchor" href="#entry-storage-format" aria-label="Permalink to &quot;Entry storage format&quot;">​</a></h2><p><code>importedData.entries</code> is an array of lab snapshots. Each entry has a date and a flat markers object:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  date</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;2025-03-15&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  markers</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;biochemistry.glucose&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5.2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;hormones.testosterone&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">18.4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;lipids.triglycerides&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1.1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>Multiple entries on the same date are merged (via <code>Object.assign</code>) into a single lookup slot. The pipeline builds <code>entryLookup: { &quot;2025-03-15&quot;: { &quot;biochemistry.glucose&quot;: 5.2, ... } }</code> before populating values arrays.</p><h2 id="values-arrays-—-aligned-with-dates" tabindex="-1">Values arrays — aligned with dates <a class="header-anchor" href="#values-arrays-—-aligned-with-dates" aria-label="Permalink to &quot;Values arrays — aligned with dates&quot;">​</a></h2><p>Every marker in the output has a <code>values</code> array aligned with <code>data.dates</code>:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">data.dates   </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;2024-09-01&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;2024-12-01&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;2025-03-15&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">marker.values </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4.8</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,          </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5.1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,          </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         ]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//                                           ^ no result for this date</span></span></code></pre></div><p><code>null</code> means the marker was not measured on that date. Charts use <code>spanGaps: true</code> to draw lines across gaps. Status functions check for <code>null</code> before evaluating.</p><h2 id="singlepoint-categories" tabindex="-1">singlePoint categories <a class="header-anchor" href="#singlepoint-categories" aria-label="Permalink to &quot;singlePoint categories&quot;">​</a></h2><p>The <code>fattyAcids</code> category has <code>singlePoint: true</code> in the schema. These markers typically come from a single test, not a time series. The pipeline handles them differently:</p><ul><li>Only the <strong>latest</strong> entry date is used, stored as <code>cat.singleDate</code></li><li>Each marker gets <code>marker.singlePoint = true</code> and a single-element <code>marker.values</code> array</li><li>Views render grid cards instead of trend charts for these categories</li></ul><h2 id="custom-markers" tabindex="-1">Custom markers <a class="header-anchor" href="#custom-markers" aria-label="Permalink to &quot;Custom markers&quot;">​</a></h2><p>Markers not in <code>MARKER_SCHEMA</code> are auto-imported from PDFs. The pipeline merges them into <code>data.categories</code> at runtime:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// importedData.customMarkers:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;mylab.cortisol&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    name: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Cortisol (AM)&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    unit: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;nmol/L&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    refMin: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">170</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    refMax: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">720</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    categoryLabel: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;My Lab&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>If the category key does not exist in the schema, a new category is created with a bookmark icon. Custom markers have <code>marker.custom = true</code> and are treated identically to schema markers in all views.</p><h2 id="calculated-markers" tabindex="-1">Calculated markers <a class="header-anchor" href="#calculated-markers" aria-label="Permalink to &quot;Calculated markers&quot;">​</a></h2><p>These are computed in-pipeline and stored in the <code>calculatedRatios</code> category:</p><table tabindex="0"><thead><tr><th>Marker key</th><th>Formula</th></tr></thead><tbody><tr><td><code>tgHdlRatio</code></td><td>Triglycerides / HDL</td></tr><tr><td><code>ldlHdlRatio</code></td><td>LDL / HDL</td></tr><tr><td><code>apoBapoAIRatio</code></td><td>ApoB / ApoAI</td></tr><tr><td><code>nlr</code></td><td>Neutrophils / Lymphocytes</td></tr><tr><td><code>plr</code></td><td>Platelets / Lymphocytes</td></tr><tr><td><code>deRitisRatio</code></td><td>AST / ALT</td></tr><tr><td><code>copperZincRatio</code></td><td>Copper / Zinc</td></tr><tr><td><code>bunCreatinineRatio</code></td><td><code>(urea × 2.801) / (creatinine × 0.01131)</code> — computed in US units from SI-stored values, ref 10–20</td></tr><tr><td><code>freeWaterDeficit</code></td><td><code>TBW × (Na / 140 − 1)</code> — assumes 70 kg body weight</td></tr><tr><td><code>phenoAge</code></td><td>Levine 2018 — 9 biomarkers + chronological age from DOB</td></tr></tbody></table><p>PhenoAge returns <code>null</code> if any of its 9 required inputs is missing or if DOB is not set.</p><h2 id="the-data-parameter-pattern" tabindex="-1">The <code>data</code> parameter pattern <a class="header-anchor" href="#the-data-parameter-pattern" aria-label="Permalink to &quot;The \`data\` parameter pattern&quot;">​</a></h2><p><code>getActiveData()</code> deep-clones the full schema on every call — it is not free. Views accept an optional <code>data</code> parameter so a single pipeline run can feed multiple renders:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Good: one pipeline call, passed to all sub-renders</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> refreshAll</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> data</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> getActiveData</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  filterDatesByRange</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(data);</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  showDashboard</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(data);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Bad: each sub-render calls getActiveData() independently</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> refreshAll</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  showDashboard</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();        </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// calls getActiveData() internally</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  showCategory</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(cat);     </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// calls getActiveData() again</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>When writing a new rendering function, always accept <code>data</code> as an optional parameter and call <code>getActiveData()</code> only when it is not provided.</p>`,34)])])}const g=a(p,[["render",t]]);export{k as __pageData,g as default};
