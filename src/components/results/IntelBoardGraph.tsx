'use client';

import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { CaseData } from '@/types/case';
import { Network, Play, Square, RotateCcw, Info, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface IntelBoardGraphProps {
  caseData: CaseData;
}

export function IntelBoardGraph({ caseData }: IntelBoardGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const simTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const [currentSimStep, setCurrentSimStep] = useState<number | null>(null);
  const [hoveredNodeInfo, setHoveredNodeInfo] = useState<string | null>(null);

  const parties = caseData.parties || [];
  const evidence = caseData.availableEvidence || [];
  const rawEvents = caseData.chronology || [];

  const sortedEvents = [...rawEvents]
    .sort((a, b) => (a.datetime || '').localeCompare(b.datetime || ''))
    .map((ev, idx) => ({ ...ev, order: idx + 1, id: 'ev_' + idx }));

  const buildGraphLayout = () => {
    if (!containerRef.current) return;

    const nodes: cytoscape.NodeDefinition[] = [];
    const edges: cytoscape.EdgeDefinition[] = [];
    const isDark = document.documentElement.classList.contains('dark');

    // 1. Root Case Node (Left)
    const shortCaseTitle = (caseData.title || 'PERKARA PIDANA').toUpperCase();
    const regimeText = caseData.legalRegime === 'KUHP_2023' ? 'KUHP NASIONAL' : 'KUHP LAMA (WvS)';
    
    nodes.push({
      data: {
        id: 'case_root',
        label: `📁 BERKAS KASUS\n${shortCaseTitle}\n(${regimeText})`,
        sublabel: caseData.lpNumber || 'LP Resmi',
        type: 'case_root',
        info: `Berkas Utama: ${caseData.title} | LP: ${caseData.lpNumber || '-'} | Pasal: ${caseData.mainArticle || '-'}`,
      },
    });

    // 2. Chronology Event Nodes (Central Spine)
    sortedEvents.forEach((ev, idx) => {
      const timeStr = ev.datetime
        ? new Date(ev.datetime).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : `Kronologi #${idx + 1}`;

      const locStr = ev.location ? `📍 ${ev.location}` : '📍 TKP';

      nodes.push({
        data: {
          id: ev.id,
          label: `⏱️ KRONOLOGI #${ev.order}\n${timeStr}\n${locStr}`,
          sublabel: timeStr,
          type: 'event',
          order: ev.order,
          info: `KRONOLOGI #${ev.order} [${timeStr} - ${locStr}]: ${ev.narrative}`,
        },
      });
    });

    // Connect Root to the first Chronology Node
    if (sortedEvents.length > 0) {
      edges.push({
        data: {
          id: 'edge_root_ev0',
          source: 'case_root',
          target: sortedEvents[0].id,
          type: 'root_link',
        },
      });
    }

    // Connect Chronology Nodes sequentially: ev_0 -> ev_1 -> ev_2 with label "Selanjutnya"
    for (let i = 0; i < sortedEvents.length - 1; i++) {
      edges.push({
        data: {
          id: `edge_seq_${i}_${i + 1}`,
          source: sortedEvents[i].id,
          target: sortedEvents[i + 1].id,
          label: 'Selanjutnya',
          type: 'chronology_flow',
        },
      });
    }

    // 3. Parties Nodes (Terlapor, Korban, Saksi)
    parties.forEach((p, idx) => {
      let nodeType = 'witness';
      let typeLabel = '🗣️ SAKSI';
      if (p.role === 'Tersangka') {
        nodeType = 'suspect';
        typeLabel = '👤 TERLAPOR';
      } else if (p.role === 'Korban / Pelapor') {
        nodeType = 'victim';
        typeLabel = '🛡️ KORBAN';
      } else if (p.role === 'Saksi Ahli') {
        typeLabel = '🎓 SAKSI AHLI';
      }

      const noteSuffix = p.notes ? `\n(${p.notes})` : '';

      nodes.push({
        data: {
          id: p.id || 'p_' + idx,
          label: `${typeLabel}\n${p.name}${noteSuffix}`,
          sublabel: p.role,
          type: nodeType,
          info: `${p.role}: ${p.name} - ${p.notes || 'Pihak Terkait'}`,
        },
      });
    });

    // 4. Evidence Nodes (Barang Bukti)
    evidence.forEach((evName, idx) => {
      nodes.push({
        data: {
          id: 'evid_' + idx,
          label: `📑 BUKTI\n${evName}`,
          sublabel: 'Alat Bukti',
          type: 'evidence',
          info: `Alat Bukti Sah: ${evName}`,
        },
      });
    });

    // 5. Connect Entities to Chronology Events (Benang Merah - Red Thread)
    let edgeCount = 0;
    const findKeyword = (text: string, kw: string) => {
      const first = (kw.split(/[\s,(]+/)[0] || '').toLowerCase();
      return first.length > 2 && text.toLowerCase().includes(first);
    };

    const evidenceKeywords: Record<string, string[]> = {
      'Keterangan saksi': ['saksi', 'melihat', 'kesaksian', 'keterangan'],
      'Keterangan ahli': ['ahli', 'forensik', 'audit', 'pakar', 'visum'],
      'Surat': ['surat', 'dokumen', 'laporan', 'rekening', 'kontrak', 'resi', 'faktur'],
      'Petunjuk': ['petunjuk', 'indikasi', 'jejak', 'analisis'],
      'Keterangan terdakwa': ['terdakwa', 'tersangka', 'mengaku', 'keterangan', 'pengakuan'],
      'Bukti elektronik': ['cctv', 'elektronik', 'laptop', 'rekaman', 'hp', 'digital', 'dvr', 'chat', 'wa', 'pesan', 'log'],
    };

    const connectedParties = new Set<string>();
    const connectedEvidences = new Set<string>();

    sortedEvents.forEach((ev) => {
      const text = (ev.narrative || '').toLowerCase();

      // Connect parties matching narrative keywords
      parties.forEach((p, pIdx) => {
        const pId = p.id || 'p_' + pIdx;
        if (findKeyword(text, p.name) || (p.notes && findKeyword(text, p.notes))) {
          edges.push({
            data: {
              id: `edge_party_${edgeCount++}`,
              source: pId,
              target: ev.id,
              type: 'benang_merah',
            },
          });
          connectedParties.add(pId);
        }
      });

      // Connect evidence matching narrative
      evidence.forEach((evName, evIdx) => {
        const evidId = 'evid_' + evIdx;
        const kws = evidenceKeywords[evName] || [evName.toLowerCase()];
        if (kws.some((kw) => text.includes(kw)) || text.includes(evName.toLowerCase())) {
          edges.push({
            data: {
              id: `edge_evid_${edgeCount++}`,
              source: evidId,
              target: ev.id,
              type: 'benang_merah',
            },
          });
          connectedEvidences.add(evidId);
        }
      });
    });

    // Fallback connection: If an entity was not linked by narrative keyword, connect to primary/closest event or case root
    parties.forEach((p, pIdx) => {
      const pId = p.id || 'p_' + pIdx;
      if (!connectedParties.has(pId)) {
        if (p.role === 'Tersangka' && sortedEvents.length > 0) {
          edges.push({
            data: {
              id: `edge_fallback_p_${edgeCount++}`,
              source: pId,
              target: sortedEvents[0].id,
              type: 'benang_merah',
            },
          });
        } else {
          edges.push({
            data: {
              id: `edge_fallback_p_${edgeCount++}`,
              source: 'case_root',
              target: pId,
              type: 'root_link',
            },
          });
        }
      }
    });

    evidence.forEach((_, evIdx) => {
      const evidId = 'evid_' + evIdx;
      if (!connectedEvidences.has(evidId) && sortedEvents.length > 0) {
        // connect to nearest event
        const targetEv = sortedEvents[evIdx % sortedEvents.length];
        edges.push({
          data: {
            id: `edge_fallback_evid_${edgeCount++}`,
            source: evidId,
            target: targetEv.id,
            type: 'benang_merah',
          },
        });
      }
    });

    // Initialize Cytoscape
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements: [...nodes, ...edges],
      style: [
        // Base Node Style
        {
          selector: 'node',
          style: {
            'shape': 'round-rectangle',
            'background-color': isDark ? '#1e293b' : '#ffffff',
            'border-width': 2,
            'border-color': isDark ? '#475569' : '#cbd5e1',
            'label': 'data(label)',
            'font-family': 'sans-serif',
            'font-size': '10px',
            'font-weight': 600,
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': '125px',
            'color': isDark ? '#f1f5f9' : '#1e293b',
            'padding': '8px',
            'width': 'label',
            'height': 'label',
          },
        },

        // 1. Root Case Node (Black / Dark Navy Card with Amber Title)
        {
          selector: 'node[type="case_root"]',
          style: {
            'background-color': '#0f172a',
            'border-color': '#334155',
            'border-width': 2,
            'color': '#ffffff',
            'font-size': '10px',
            'font-weight': 'bold',
            'text-max-width': '140px',
            'padding': '12px',
          },
        },

        // 2. Chronology Event Nodes (Lavender/White with Purple/Indigo border)
        {
          selector: 'node[type="event"]',
          style: {
            'background-color': isDark ? '#1e1b4b' : '#faf5ff',
            'border-color': '#6366f1',
            'border-width': 2.5,
            'color': isDark ? '#e0e7ff' : '#3730a3',
            'font-size': '9.5px',
            'text-max-width': '135px',
            'padding': '10px',
          },
        },

        // 3. Terlapor / Tersangka Nodes (Light Red/Pink with Red border)
        {
          selector: 'node[type="suspect"]',
          style: {
            'background-color': isDark ? '#4c0519' : '#fff1f2',
            'border-color': '#ef4444',
            'border-width': 2,
            'color': isDark ? '#fecdd3' : '#9f1239',
            'font-size': '9px',
            'text-max-width': '120px',
            'padding': '8px',
          },
        },

        // 4. Korban Nodes (Light Green with Emerald border)
        {
          selector: 'node[type="victim"]',
          style: {
            'background-color': isDark ? '#022c22' : '#f0fdf4',
            'border-color': '#10b981',
            'border-width': 2,
            'color': isDark ? '#a7f3d0' : '#065f46',
            'font-size': '9px',
            'text-max-width': '115px',
            'padding': '8px',
          },
        },

        // 5. Saksi Nodes (Light Orange with Amber border)
        {
          selector: 'node[type="witness"]',
          style: {
            'background-color': isDark ? '#451a03' : '#fffbeb',
            'border-color': '#f59e0b',
            'border-width': 2,
            'color': isDark ? '#fde68a' : '#92400e',
            'font-size': '9px',
            'text-max-width': '120px',
            'padding': '8px',
          },
        },

        // 6. Bukti Nodes (Light Blue with Blue border)
        {
          selector: 'node[type="evidence"]',
          style: {
            'background-color': isDark ? '#172554' : '#eff6ff',
            'border-color': '#3b82f6',
            'border-width': 2,
            'color': isDark ? '#bfdbfe' : '#1e40af',
            'font-size': '9px',
            'text-max-width': '120px',
            'padding': '8px',
          },
        },

        // --- EDGES STYLING ---

        // Chronology to Chronology: Solid Black Arrow with "Selanjutnya" Label
        {
          selector: 'edge[type="chronology_flow"]',
          style: {
            'width': 3,
            'line-color': isDark ? '#e2e8f0' : '#0f172a',
            'target-arrow-color': isDark ? '#e2e8f0' : '#0f172a',
            'target-arrow-shape': 'triangle',
            'arrow-scale': 1.4,
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '8.5px',
            'font-style': 'italic',
            'font-weight': 600,
            'color': isDark ? '#94a3b8' : '#475569',
            'text-rotation': 'autorotate',
            'text-margin-y': -8,
            'text-background-color': isDark ? '#090d16' : '#ffffff',
            'text-background-opacity': 0.8,
            'text-background-padding': '2px',
          },
        },

        // The Benang Merah (Red Thread) dashed edges linking entities to events
        {
          selector: 'edge[type="benang_merah"]',
          style: {
            'width': 2,
            'line-color': '#ef4444',
            'line-style': 'dashed',
            'line-dash-pattern': [6, 4],
            'curve-style': 'bezier',
            'opacity': 0.85,
          },
        },

        // Root / Case link edges
        {
          selector: 'edge[type="root_link"]',
          style: {
            'width': 1.5,
            'line-color': isDark ? '#475569' : '#94a3b8',
            'line-style': 'dashed',
            'line-dash-pattern': [4, 4],
            'target-arrow-shape': 'triangle',
            'target-arrow-color': isDark ? '#475569' : '#94a3b8',
            'arrow-scale': 0.9,
            'curve-style': 'bezier',
            'opacity': 0.6,
          },
        },

        // Simulation Highlights
        {
          selector: '.dimmed',
          style: {
            'opacity': 0.15,
          },
        },
        {
          selector: '.highlighted',
          style: {
            'opacity': 1,
            'border-width': 4,
            'border-color': '#f59e0b',
            'line-color': '#f59e0b',
            'width': 3.5,
          },
        },
      ],
      layout: {
        name: 'cose',
        animate: false,
        randomize: false,
        componentSpacing: 100,
        nodeOverlap: 20,
        nodeRepulsion: () => 450000,
        idealEdgeLength: (edge: any) => {
          const type = edge.data('type');
          if (type === 'chronology_flow') return 220;
          if (type === 'benang_merah') return 140;
          return 180;
        },
        edgeElasticity: () => 100,
        gravity: 1,
        padding: 50,
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
    });

    cy.on('mouseover', 'node', (evt) => {
      const node = evt.target;
      setHoveredNodeInfo(node.data('info') || node.data('label'));
    });

    cy.on('mouseout', 'node', () => {
      setHoveredNodeInfo(null);
    });

    cyRef.current = cy;
  };

  useEffect(() => {
    buildGraphLayout();

    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
      if (cyRef.current) cyRef.current.destroy();
    };
  }, [parties.length, evidence.length, rawEvents.length, caseData.title]);

  const resetHighlight = () => {
    if (simTimerRef.current) {
      clearInterval(simTimerRef.current);
      simTimerRef.current = null;
    }
    setIsSimulating(false);
    setCurrentSimStep(null);
    if (cyRef.current) {
      cyRef.current.elements().removeClass('dimmed').removeClass('highlighted');
      cyRef.current.fit(undefined, 40);
    }
  };

  const showStep = (idx: number) => {
    if (!cyRef.current || !sortedEvents[idx]) return;
    const cy = cyRef.current;
    const ev = sortedEvents[idx];

    cy.elements().addClass('dimmed').removeClass('highlighted');
    const evNode = cy.$id(ev.id);
    const neighborhood = evNode.closedNeighborhood();

    neighborhood.removeClass('dimmed').addClass('highlighted');
    setCurrentSimStep(idx + 1);
    setHoveredNodeInfo(`KRONOLOGI #${ev.order}: ${ev.narrative}`);
  };

  const toggleSimulation = () => {
    if (sortedEvents.length === 0) return;

    if (isSimulating) {
      resetHighlight();
    } else {
      setIsSimulating(true);
      let step = 0;
      showStep(step);

      simTimerRef.current = setInterval(() => {
        step++;
        if (step >= sortedEvents.length) {
          resetHighlight();
        } else {
          showStep(step);
        }
      }, 2600);
    }
  };

  const handleZoomIn = () => {
    if (cyRef.current) cyRef.current.zoom(cyRef.current.zoom() * 1.25);
  };

  const handleZoomOut = () => {
    if (cyRef.current) cyRef.current.zoom(cyRef.current.zoom() * 0.8);
  };

  const handleFit = () => {
    if (cyRef.current) cyRef.current.fit(undefined, 40);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-md dark:border-slate-800 dark:bg-slate-900">
      {/* Graph Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 px-5 py-4 text-white border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold shadow-sm">
            <Network className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-serif tracking-tight">
              Papan Intelijen — Peta Benang Merah Perkara
            </h3>
            <p className="text-[11px] text-slate-400">
              Visualisasi alur peristiwa kronologis &amp; relasi benang merah subjek dengan alat bukti
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900 p-0.5">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Perbesar (Zoom In)"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Perkecil (Zoom Out)"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleFit}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Pusatkan Peta"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={toggleSimulation}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-amber-500 transition"
          >
            {isSimulating ? (
              <>
                <Square className="h-3.5 w-3.5 fill-current" />
                <span>Hentikan Alur</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Putar Simulasi Alur</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={resetHighlight}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Tampilan</span>
          </button>
        </div>
      </div>

      {/* Legend & Active Step Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-2.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300">
        <div className="flex items-center gap-4 flex-wrap text-[11px] font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-4 rounded border-2 border-rose-500 bg-rose-50 dark:bg-rose-950" /> Terlapor / Tersangka
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-4 rounded border-2 border-blue-500 bg-blue-50 dark:bg-blue-950" /> Barang Bukti
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-4 rounded border-2 border-amber-500 bg-amber-50 dark:bg-amber-950" /> Saksi / Ahli
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-4 rounded border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950" /> Korban
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-4 rounded border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-950" /> Alur Kronologi
          </span>
          <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-mono font-bold">
            <span className="inline-block w-4 border-t-2 border-dashed border-rose-500" /> Benang Merah
          </span>
        </div>

        {currentSimStep && (
          <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 animate-pulse">
            ▶ Tahap Simulasi {currentSimStep} / {sortedEvents.length}
          </span>
        )}
      </div>

      {/* Cytoscape Canvas Container */}
      <div className="relative">
        <div
          ref={containerRef}
          className="h-[520px] w-full bg-slate-50/60 dark:bg-slate-950"
          style={{ cursor: 'grab' }}
        />

        {hoveredNodeInfo && (
          <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-slate-200 bg-white/95 p-3.5 text-xs text-slate-800 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-200 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="line-clamp-2 leading-relaxed">{hoveredNodeInfo}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
