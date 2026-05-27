import { stroke } from "@oai/artifact-tool";

const C = {
  bg: "#F2F0EA",
  card: "#FFFFFF",
  shadow: "#DED9CE",
  ink: "#11110F",
  muted: "#6C675F",
  rule: "#171715",
  softRule: "#D8D3C9",
  lime: "#DFFF42",
  limeSoft: "#ECFF99",
  orange: "#F47A1F",
  blue: "#64A8FF",
  mint: "#BEEFD8",
  mint2: "#DDF6EA",
  dark: "#10100E",
  dark2: "#1D1D19",
  warm: "#F6F3EA",
  danger: "#EFE9DF",
};

const W = 1280;
const H = 720;
const CARD = { x: 46, y: 38, w: 1188, h: 644 };
const FONT_HEAD = "Aptos Display";
const FONT_BODY = "Aptos";

function lineSpec(value) {
  return typeof value === "string" ? stroke(value) : value;
}

function addShape(slide, geometry, x, y, w, h, opts = {}) {
  const sh = slide.shapes.add({
    geometry,
    fill: opts.fill ?? "none",
    line: lineSpec(opts.line ?? "none"),
    name: opts.name ?? "",
  });
  sh.position.set({ left: x, top: y, width: w, height: h });
  return sh;
}

function addLine(slide, x1, y1, x2, y2, opts = {}) {
  const left = Math.min(x1, x2);
  const top = Math.min(y1, y2);
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);
  const slopesUp = (x2 - x1) * (y2 - y1) < 0;
  return addShape(slide, slopesUp ? "lineInv" : "line", left, top, width, height, {
    line: `${opts.width ?? 2}px ${opts.style ?? "solid"} ${opts.color ?? C.ink}`,
    fill: "none",
    name: opts.name,
  });
}

function addText(slide, value, x, y, w, h, opts = {}) {
  const box = addShape(slide, "rect", x, y, w, h, {
    fill: opts.fill ?? "none",
    line: opts.line ?? "none",
    name: opts.name,
  });
  box.text.set(value);
  box.text.typeface = opts.typeface ?? FONT_BODY;
  box.text.fontSize = opts.size ?? 18;
  box.text.bold = opts.bold ?? false;
  box.text.italic = opts.italic ?? false;
  box.text.color = opts.color ?? C.ink;
  box.text.alignment = opts.align ?? "left";
  box.text.verticalAlignment = opts.valign ?? "top";
  box.text.insets = opts.insets ?? { top: 0, right: 0, bottom: 0, left: 0 };
  box.text.wrap = "square";
  if (opts.lineSpacing !== undefined) box.text.lineSpacing = opts.lineSpacing;
  return box;
}

function softCard(slide, x, y, w, h, opts = {}) {
  const shadowOffset = opts.shadowOffset ?? 6;
  if (opts.shadow !== false) {
    addShape(slide, "roundRect", x + shadowOffset, y + shadowOffset, w, h, {
      fill: opts.shadowFill ?? C.shadow,
      line: "none",
      name: `${opts.name ?? "card"} shadow`,
    });
  }
  return addShape(slide, "roundRect", x, y, w, h, {
    fill: opts.fill ?? C.card,
    line: opts.line ?? `1px ${opts.outline ?? C.rule}`,
    name: opts.name ?? "card",
  });
}

function baseSlide(presentation, opts = {}) {
  const slide = presentation.slides.add();
  slide.background.fill = opts.bg ?? C.bg;
  if (opts.dark) {
    softCard(slide, CARD.x, CARD.y, CARD.w, CARD.h, {
      fill: C.dark,
      outline: C.dark,
      shadowFill: "#D4D0C6",
      name: "dark slide card",
    });
  } else {
    softCard(slide, CARD.x, CARD.y, CARD.w, CARD.h, {
      fill: C.card,
      outline: C.rule,
      name: "slide card",
    });
  }
  return slide;
}

function header(slide, title, opts = {}) {
  const dark = opts.dark ?? false;
  const x = opts.x ?? 88;
  const y = opts.y ?? 66;
  addShape(slide, "rect", x, y + 8, 8, 34, {
    fill: C.orange,
    line: "none",
    name: "orange title accent",
  });
  addText(slide, title, x + 20, y, opts.w ?? 760, 58, {
    typeface: FONT_HEAD,
    size: opts.size ?? 35,
    bold: true,
    color: dark ? C.card : C.ink,
    valign: "middle",
  });
}

function kicker(slide, value, x, y, w, opts = {}) {
  addText(slide, value, x, y, w, 24, {
    size: opts.size ?? 12,
    bold: true,
    color: opts.color ?? C.muted,
    align: opts.align ?? "left",
  });
}

function pill(slide, value, x, y, w, opts = {}) {
  addShape(slide, "roundRect", x, y, w, opts.h ?? 28, {
    fill: opts.fill ?? C.warm,
    line: opts.line ?? `1px ${opts.outline ?? C.rule}`,
  });
  addText(slide, value, x + 10, y + 3, w - 20, (opts.h ?? 28) - 6, {
    size: opts.size ?? 12,
    bold: opts.bold ?? true,
    color: opts.color ?? C.ink,
    align: "center",
    valign: "middle",
  });
}

function iconPerson(slide, cx, cy, opts = {}) {
  const accent = opts.accent ?? C.lime;
  addShape(slide, "ellipse", cx - 17, cy - 34, 34, 34, {
    fill: opts.headFill ?? C.card,
    line: `1.5px ${C.rule}`,
  });
  addShape(slide, "ellipse", cx - 8, cy - 24, 4, 4, { fill: C.rule, line: "none" });
  addShape(slide, "ellipse", cx + 4, cy - 24, 4, 4, { fill: C.rule, line: "none" });
  addShape(slide, "roundRect", cx - 30, cy + 2, 60, 52, {
    fill: opts.bodyFill ?? C.card,
    line: `1.5px ${C.rule}`,
  });
  addShape(slide, "roundRect", cx - 44, cy + 45, 88, 16, {
    fill: accent,
    line: `1.5px ${C.rule}`,
  });
  if (opts.chat) {
    addShape(slide, "roundRect", cx + 27, cy - 43, 54, 34, {
      fill: C.card,
      line: `1.5px ${C.rule}`,
    });
    addShape(slide, "triangle", cx + 35, cy - 15, 14, 12, {
      fill: C.card,
      line: `1.5px ${C.rule}`,
    });
    addLine(slide, cx + 39, cy - 31, cx + 70, cy - 31, { width: 1.4, color: C.rule });
    addLine(slide, cx + 39, cy - 22, cx + 61, cy - 22, { width: 1.4, color: C.rule });
  }
}

function iconDoc(slide, x, y, opts = {}) {
  addShape(slide, "roundRect", x, y, opts.w ?? 38, opts.h ?? 48, {
    fill: opts.fill ?? C.card,
    line: `1.5px ${opts.line ?? C.rule}`,
  });
  addShape(slide, "triangle", x + (opts.w ?? 38) - 13, y + 1, 12, 12, {
    fill: opts.fold ?? C.warm,
    line: `1px ${opts.line ?? C.rule}`,
  });
  addLine(slide, x + 8, y + 18, x + (opts.w ?? 38) - 9, y + 18, { width: 1.3, color: opts.line ?? C.rule });
  addLine(slide, x + 8, y + 28, x + (opts.w ?? 38) - 13, y + 28, { width: 1.3, color: opts.line ?? C.rule });
}

function iconBulb(slide, cx, cy, opts = {}) {
  addShape(slide, "ellipse", cx - 18, cy - 24, 36, 36, {
    fill: opts.fill ?? C.lime,
    line: `1.5px ${C.rule}`,
  });
  addShape(slide, "roundRect", cx - 11, cy + 8, 22, 18, {
    fill: C.card,
    line: `1.5px ${C.rule}`,
  });
  addLine(slide, cx - 9, cy + 17, cx + 9, cy + 17, { width: 1.2, color: C.rule });
  addLine(slide, cx - 28, cy - 10, cx - 39, cy - 17, { width: 1.6, color: opts.line ?? C.rule });
  addLine(slide, cx + 28, cy - 10, cx + 39, cy - 17, { width: 1.6, color: opts.line ?? C.rule });
  addLine(slide, cx, cy - 34, cx, cy - 46, { width: 1.6, color: opts.line ?? C.rule });
}

function checkMark(slide, x, y, opts = {}) {
  addLine(slide, x, y + 10, x + 10, y + 20, { width: opts.width ?? 3, color: opts.color ?? C.rule });
  addLine(slide, x + 10, y + 20, x + 32, y - 4, { width: opts.width ?? 3, color: opts.color ?? C.rule });
}

function iconShield(slide, cx, cy, opts = {}) {
  addShape(slide, "homePlate", cx - 38, cy - 46, 76, 88, {
    fill: opts.fill ?? C.lime,
    line: `2px ${opts.line ?? C.rule}`,
  });
  checkMark(slide, cx - 18, cy - 1, { color: opts.check ?? C.rule, width: 3.5 });
}

function cardTitle(slide, title, body, x, y, w, h, opts = {}) {
  softCard(slide, x, y, w, h, {
    fill: opts.fill ?? C.card,
    outline: opts.outline ?? C.rule,
    shadowFill: opts.shadowFill ?? C.shadow,
    shadowOffset: opts.shadowOffset ?? 4,
    name: opts.name ?? title,
  });
  if (opts.accent) {
    addShape(slide, "rect", x + 18, y + 18, 28, 8, {
      fill: opts.accent,
      line: "none",
    });
  }
  const titleH = opts.titleHeight ?? (title.includes("\n") || title.length > 30 ? 54 : 34);
  addText(slide, title, x + 20, y + 30, opts.titleWidth ?? (w - 40), titleH, {
    typeface: FONT_HEAD,
    size: opts.titleSize ?? 22,
    bold: true,
    color: opts.dark ? C.card : C.ink,
  });
  const bodyY = y + 30 + titleH + 8;
  addText(slide, body, x + 20, bodyY, w - 40, h - (bodyY - y) - 18, {
    size: opts.bodySize ?? 15,
    color: opts.dark ? "#EDEBE5" : C.muted,
  });
}

function progressBar(slide, label, x, y, w, color, opts = {}) {
  addText(slide, label, x, y - 27, w, 22, {
    size: opts.labelSize ?? 16,
    bold: true,
    color: opts.dark ? C.card : C.ink,
  });
  addShape(slide, "roundRect", x, y, w, 24, {
    fill: opts.track ?? "#EBE7DE",
    line: opts.outline ?? `1px ${opts.dark ? "#3C3C35" : C.rule}`,
  });
  addShape(slide, "roundRect", x + 5, y + 5, Math.max(24, w * (opts.level ?? 0.66)), 14, {
    fill: color,
    line: "none",
  });
  if (opts.dot) {
    addShape(slide, "ellipse", x + w * (opts.level ?? 0.66) - 5, y - 3, 30, 30, {
      fill: C.card,
      line: `1.5px ${C.rule}`,
    });
  }
}

function node(slide, cx, cy, label, opts = {}) {
  addShape(slide, "ellipse", cx - 24, cy - 24, 48, 48, {
    fill: opts.fill ?? C.card,
    line: `2px ${opts.line ?? C.rule}`,
  });
  if (opts.dot) {
    addShape(slide, "ellipse", cx - 6, cy - 6, 12, 12, { fill: opts.dot, line: "none" });
  }
  addText(slide, label, cx - 74, cy + 34, 148, 26, {
    size: opts.size ?? 12,
    bold: true,
    color: opts.textColor ?? C.ink,
    align: "center",
  });
}

function tinyDots(slide, x, y, colors = [C.orange, C.blue, C.lime]) {
  colors.forEach((color, i) => {
    addShape(slide, "ellipse", x + i * 18, y, 10, 10, { fill: color, line: `1px ${C.rule}` });
  });
}

function statusMini(slide, x, y, color, text) {
  addShape(slide, "ellipse", x, y + 4, 10, 10, { fill: color, line: "none" });
  addText(slide, text, x + 16, y, 120, 22, { size: 12, color: C.muted, bold: true });
}

function loopIcon(slide, cx, cy, color = C.orange) {
  addShape(slide, "circularArrow", cx - 18, cy - 18, 36, 36, {
    fill: "none",
    line: `2px ${color}`,
  });
}

function linkedPair(slide, x, y, color = C.blue) {
  addShape(slide, "ellipse", x, y, 22, 22, { fill: color, line: `1.4px ${C.rule}` });
  addShape(slide, "ellipse", x + 28, y, 22, 22, { fill: C.card, line: `1.4px ${C.rule}` });
  addLine(slide, x + 20, y + 11, x + 30, y + 11, { width: 1.6, color: C.rule });
}

function phoneMockup(slide) {
  const x = 780;
  const y = 78;
  const w = 330;
  const h = 536;
  addShape(slide, "roundRect", x + 16, y + 18, w, h, {
    fill: "#D8D3C8",
    line: "none",
  });
  addShape(slide, "roundRect", x, y, w, h, {
    fill: C.dark,
    line: `2px ${C.rule}`,
  });
  addShape(slide, "roundRect", x + 22, y + 24, w - 44, h - 48, {
    fill: "#F8F6EF",
    line: "none",
  });
  addShape(slide, "roundRect", x + 132, y + 15, 70, 8, {
    fill: "#2A2A24",
    line: "none",
  });
  tinyDots(slide, x + 45, y + 52);
  addText(slide, "DISCOVERY", x + 210, y + 47, 70, 18, {
    size: 9,
    bold: true,
    color: C.muted,
    align: "right",
  });
  softCard(slide, x + 46, y + 86, 238, 82, {
    fill: C.card,
    outline: C.rule,
    shadowFill: "#E7E2D8",
    shadowOffset: 3,
  });
  iconBulb(slide, x + 79, y + 126, { fill: C.limeSoft });
  addLine(slide, x + 122, y + 112, x + 246, y + 112, { width: 3, color: C.rule });
  addLine(slide, x + 122, y + 132, x + 217, y + 132, { width: 2, color: "#B7B0A5" });

  softCard(slide, x + 46, y + 188, 238, 82, {
    fill: C.card,
    outline: C.rule,
    shadowFill: "#E7E2D8",
    shadowOffset: 3,
  });
  iconDoc(slide, x + 60, y + 205, { w: 32, h: 42, fill: C.mint2 });
  addLine(slide, x + 108, y + 213, x + 252, y + 213, { width: 3, color: C.rule });
  addLine(slide, x + 108, y + 234, x + 206, y + 234, { width: 2, color: "#B7B0A5" });

  addShape(slide, "roundRect", x + 46, y + 294, 238, 112, {
    fill: C.lime,
    line: `2px ${C.rule}`,
  });
  addText(slide, "Protected record", x + 66, y + 316, 180, 28, {
    typeface: FONT_HEAD,
    size: 22,
    bold: true,
  });
  progressBar(slide, "", x + 66, y + 366, 196, C.dark, {
    level: 0.76,
    track: "#F8FFA8",
    outline: "none",
    labelSize: 1,
  });
  addShape(slide, "roundRect", x + 46, y + 432, 110, 50, {
    fill: C.card,
    line: `1.5px ${C.rule}`,
  });
  iconPerson(slide, x + 83, y + 438, { accent: C.orange, chat: false });
  addShape(slide, "roundRect", x + 174, y + 432, 110, 50, {
    fill: C.card,
    line: `1.5px ${C.rule}`,
  });
  linkedPair(slide, x + 207, y + 447, C.blue);
}

export function slide01(presentation) {
  const slide = baseSlide(presentation);
  addShape(slide, "rect", 88, 118, 10, 52, { fill: C.orange, line: "none" });
  addShape(slide, "roundRect", 108, 474, 430, 84, {
    fill: C.warm,
    line: `1.5px ${C.rule}`,
  });
  addText(slide, "Student Innovation Discovery Platform", 132, 492, 350, 26, {
    size: 15,
    bold: true,
  });
  addText(slide, "A trusted continuation ecosystem for student innovation.", 132, 522, 360, 22, {
    size: 13,
    color: C.muted,
  });
  addShape(slide, "rect", 500, 495, 54, 16, { fill: C.lime, line: `1.3px ${C.rule}` });
  phoneMockup(slide);
  addText(slide, "Ideas should not die\nafter the first\nprototype.", 110, 100, 560, 238, {
    typeface: FONT_HEAD,
    size: 56,
    bold: true,
  });
  addText(slide, "Student ideas need protection, proof, validation, and a path to continue.", 112, 360, 500, 62, {
    size: 22,
    color: C.muted,
  });
  return slide;
}

export function slide02(presentation) {
  const slide = baseSlide(presentation);
  header(slide, "Problem statement");
  addShape(slide, "rect", 545, 138, 222, 34, { fill: C.lime, line: "none" });
  addText(slide, "The problem is not idea generation.\nThe problem is idea continuation.", 104, 130, 820, 86, {
    typeface: FONT_HEAD,
    size: 29,
    bold: true,
  });
  const cards = [
    ["Ideas start strong", "Hackathons and courses create momentum.", C.orange],
    ["Proof gets lost", "Files, feedback, and authorship scatter.", C.blue],
    ["Support is fragmented", "Mentors, campuses, and backers work apart.", C.lime],
  ];
  cards.forEach(([title, body, color], i) => {
    const x = 102 + i * 358;
    cardTitle(slide, title, body, x, 236, 300, 126, {
      accent: color,
      titleSize: 20,
      titleWidth: 220,
      bodySize: 14,
    });
    addShape(slide, "roundRect", x + 244, 258, 38, 38, { fill: color, line: `1.5px ${C.rule}` });
    addLine(slide, x + 254, 277, x + 272, 277, { width: 2.2, color: C.rule });
  });
  iconPerson(slide, 214, 478, { accent: C.orange, chat: true });
  iconPerson(slide, 640, 478, { accent: C.blue, chat: true });
  iconPerson(slide, 1066, 478, { accent: C.lime, chat: true });
  addLine(slide, 298, 503, 558, 503, { width: 2, style: "dotted", color: "#C8C1B6" });
  addLine(slide, 724, 503, 982, 503, { width: 2, style: "dotted", color: "#C8C1B6" });
  addText(slide, "Post-hackathon drop-off is a continuation gap, not a creativity gap.", 326, 590, 630, 32, {
    size: 15,
    bold: true,
    color: C.muted,
    align: "center",
  });
  return slide;
}

export function slide03(presentation) {
  const slide = baseSlide(presentation);
  header(slide, "What is being solved");
  cardTitle(slide, "For students", "Safe continuation\nOwnership proof\nControlled sharing", 90, 170, 360, 166, {
    accent: C.lime,
  });
  cardTitle(slide, "For ecosystem", "Trusted validation\nMentor signal\nInvestor confidence", 90, 374, 360, 166, {
    accent: C.orange,
  });
  addText(slide, "Launch as a curated trust-and-continuation platform first.", 112, 566, 330, 34, {
    size: 14,
    bold: true,
    color: C.muted,
  });

  addShape(slide, "roundRect", 560, 186, 225, 184, {
    fill: C.dark,
    line: `2px ${C.rule}`,
  });
  tinyDots(slide, 584, 208, [C.orange, C.blue, C.lime]);
  addLine(slide, 594, 258, 744, 258, { width: 5, color: C.lime });
  addLine(slide, 594, 288, 716, 288, { width: 4, color: C.orange });
  addLine(slide, 594, 318, 748, 318, { width: 4, color: C.blue });
  addText(slide, "Version history\nProof of creation", 593, 228, 150, 32, {
    size: 12,
    bold: true,
    color: C.card,
  });

  iconShield(slide, 840, 305, { fill: C.lime });
  addText(slide, "Validation layer", 782, 372, 120, 24, {
    size: 13,
    bold: true,
    align: "center",
  });
  addLine(slide, 785, 278, 802, 278, { width: 2, style: "dotted", color: C.rule });
  addLine(slide, 878, 278, 905, 278, { width: 2, style: "dotted", color: C.rule });

  softCard(slide, 920, 190, 240, 226, {
    fill: C.card,
    outline: C.rule,
    shadowOffset: 5,
  });
  addText(slide, "Mentor review", 944, 216, 150, 24, {
    typeface: FONT_HEAD,
    size: 20,
    bold: true,
  });
  statusMini(slide, 946, 260, C.lime, "Originality");
  statusMini(slide, 946, 292, C.blue, "Feasibility");
  statusMini(slide, 946, 324, C.orange, "Next step");
  progressBar(slide, "Validation score", 946, 378, 170, C.lime, {
    level: 0.72,
    track: C.warm,
    labelSize: 12,
  });
  pill(slide, "Curated access builds trust", 678, 492, 310, { fill: C.limeSoft, h: 34 });
  return slide;
}

const stepData = [
  ["Verify", "Student identity", "check", C.orange],
  ["Upload", "Project evidence", "upload", C.blue],
  ["Protect", "Version history", "shield", C.lime],
  ["Review", "Mentor score", "chat", C.mint],
  ["Match", "Collaborators", "match", C.blue],
  ["Continue", "Milestones", "loop", C.orange],
];

function stepIcon(slide, kind, cx, cy, color) {
  if (kind === "check") {
    addShape(slide, "ellipse", cx - 20, cy - 20, 40, 40, { fill: color, line: `1.5px ${C.rule}` });
    checkMark(slide, cx - 14, cy - 2, { width: 2.5, color: C.rule });
  } else if (kind === "upload") {
    addShape(slide, "roundRect", cx - 22, cy - 16, 44, 34, { fill: C.card, line: `1.5px ${C.rule}` });
    addShape(slide, "upArrow", cx - 13, cy - 25, 26, 28, { fill: color, line: `1.4px ${C.rule}` });
  } else if (kind === "shield") {
    iconShield(slide, cx, cy + 5, { fill: color });
  } else if (kind === "chat") {
    addShape(slide, "roundRect", cx - 25, cy - 18, 50, 36, { fill: color, line: `1.5px ${C.rule}` });
    addLine(slide, cx - 12, cy - 6, cx + 12, cy - 6, { width: 1.5, color: C.rule });
    addLine(slide, cx - 12, cy + 5, cx + 6, cy + 5, { width: 1.5, color: C.rule });
  } else if (kind === "match") {
    linkedPair(slide, cx - 25, cy - 10, color);
  } else {
    loopIcon(slide, cx, cy, color);
  }
}

export function slide04(presentation) {
  const slide = baseSlide(presentation);
  header(slide, "How it works");
  addShape(slide, "roundRect", 126, 220, 1030, 222, {
    fill: C.warm,
    line: `1.5px ${C.rule}`,
  });
  addLine(slide, 188, 330, 1086, 330, { width: 2, style: "dotted", color: "#BEB7AB" });
  stepData.forEach(([title, body, kind, color], i) => {
    const x = 154 + i * 166;
    softCard(slide, x, 246, 128, 166, {
      fill: C.card,
      outline: C.rule,
      shadowOffset: 3,
    });
    stepIcon(slide, kind, x + 64, 294, color);
    addText(slide, title, x + 14, 338, 100, 28, {
      typeface: FONT_HEAD,
      size: 20,
      bold: true,
      align: "center",
    });
    addText(slide, body, x + 12, 370, 104, 28, {
      size: 12,
      bold: true,
      color: C.muted,
      align: "center",
    });
    if (i < stepData.length - 1) {
      addShape(slide, "ellipse", x + 145, 324, 12, 12, { fill: C.lime, line: `1px ${C.rule}` });
    }
  });
  addText(slide, "Student verification, proof of creation, structured feedback, and collaborator discovery stay attached to the same project record.", 164, 500, 930, 44, {
    size: 18,
    color: C.muted,
    align: "center",
  });
  return slide;
}

export function slide05(presentation) {
  const slide = baseSlide(presentation);
  header(slide, "Value proposition");
  const cards = [
    ["For students", "Protect the idea and keep momentum.", C.orange, "person"],
    ["For mentors", "Validate originality, feasibility, and next steps.", C.blue, "review"],
    ["For investors", "Review trusted early opportunities.", C.lime, "backer"],
  ];
  cards.forEach(([title, body, color, kind], i) => {
    const x = 94 + i * 382;
    cardTitle(slide, title, body, x, 152, 318, 156, {
      accent: color,
      titleSize: 24,
      bodySize: 16,
    });
    if (kind === "person") iconPerson(slide, x + 256, 196, { accent: color });
    if (kind === "review") stepIcon(slide, "chat", x + 252, 211, color);
    if (kind === "backer") {
      addShape(slide, "ellipse", x + 228, 178, 50, 50, { fill: color, line: `1.5px ${C.rule}` });
      addShape(slide, "rect", x + 244, 193, 18, 20, { fill: C.card, line: `1.2px ${C.rule}` });
      addShape(slide, "triangle", x + 248, 184, 12, 12, { fill: C.card, line: `1.2px ${C.rule}` });
    }
  });
  addShape(slide, "roundRect", 136, 392, 1008, 206, {
    fill: C.warm,
    line: `1.5px ${C.rule}`,
  });
  progressBar(slide, "Student trust", 196, 442, 820, C.orange, { level: 0.52 });
  progressBar(slide, "Mentor signal", 196, 502, 820, C.blue, { level: 0.68 });
  progressBar(slide, "Investor confidence", 196, 562, 820, C.lime, { level: 0.79 });
  addText(slide, "Trust is earned through controlled access and visible validation, not open-ended exposure.", 742, 330, 360, 36, {
    size: 14,
    bold: true,
    color: C.muted,
    align: "right",
  });
  return slide;
}

export function slide06(presentation) {
  const slide = baseSlide(presentation);
  header(slide, "Failure and recovery");
  const q = [
    ["Failure mode", "Feedback disappears", 116, 152, C.danger, C.orange],
    ["Failure mode", "Ownership unclear", 652, 152, C.danger, C.orange],
    ["Recovery path", "Project record remains", 116, 402, C.card, C.lime],
    ["Recovery path", "Mentor signal\ncompounds", 652, 402, C.card, C.blue],
  ];
  q.forEach(([k, title, x, y, fill, accent]) => {
    softCard(slide, x, y, 450, 154, {
      fill,
      outline: C.rule,
      shadowOffset: 4,
    });
    addShape(slide, "rect", x + 22, y + 24, 38, 9, { fill: accent, line: "none" });
    addText(slide, k, x + 22, y + 47, 160, 22, { size: 12, bold: true, color: C.muted });
    const stackedTitle = title.includes("\n");
    addText(slide, title, x + 22, y + 76, 330, stackedTitle ? 62 : 34, {
      typeface: FONT_HEAD,
      size: stackedTitle ? 23 : 26,
      bold: true,
    });
    if (title.includes("Feedback")) {
      stepIcon(slide, "chat", x + 382, y + 83, accent);
      addLine(slide, x + 362, y + 114, x + 412, y + 64, { width: 2, color: C.rule });
    } else if (title.includes("Ownership")) {
      iconDoc(slide, x + 356, y + 62, { w: 44, h: 54, fill: C.card });
      addShape(slide, "ellipse", x + 386, y + 101, 30, 30, { fill: C.orange, line: `1.5px ${C.rule}` });
    } else if (title.includes("record")) {
      iconDoc(slide, x + 356, y + 60, { w: 48, h: 58, fill: C.limeSoft });
      checkMark(slide, x + 372, y + 102, { width: 2.4, color: C.rule });
    } else {
      progressBar(slide, "", x + 308, y + 86, 102, C.blue, { level: 0.72, labelSize: 1 });
      loopIcon(slide, x + 376, y + 86, C.blue);
    }
  });
  addLine(slide, 340, 314, 340, 397, { width: 2, style: "dotted", color: "#AFA79A" });
  addLine(slide, 876, 314, 876, 397, { width: 2, style: "dotted", color: "#AFA79A" });
  loopIcon(slide, 340, 356, C.orange);
  loopIcon(slide, 876, 356, C.blue);
  addText(slide, "Post-hackathon drop-off becomes a recoverable state.", 388, 338, 500, 32, {
    size: 16,
    bold: true,
    color: C.muted,
    align: "center",
  });
  return slide;
}

export function slide07(presentation) {
  const slide = baseSlide(presentation);
  header(slide, "Business and sustainability");
  const cards = [
    ["Campus licenses", "Campus-first rollout for verified students and project records.", C.lime],
    ["Sponsored challenges", "Sponsorships, grants, pilots, and partnerships around continuation.", C.orange],
    ["Premium mentorship / backer access", "Curated access for trusted early project review.", C.blue],
  ];
  cards.forEach(([title, body, color], i) => {
    cardTitle(slide, title, body, 88 + i * 370, 152, 314, 150, {
      accent: color,
      titleSize: 22,
      bodySize: 13,
    });
  });
  addShape(slide, "roundRect", 114, 376, 1052, 156, {
    fill: C.warm,
    line: `1.5px ${C.rule}`,
  });
  const nodes = [
    ["Universities", 232, C.lime],
    ["Mentors", 430, C.blue],
    ["Backers", 628, C.orange],
    ["Platform", 830, C.dark],
    ["Students", 1030, C.mint],
  ];
  nodes.forEach(([label, cx, color], i) => {
    addShape(slide, "roundRect", cx - 70, 415, 140, 56, {
      fill: color,
      line: `1.6px ${C.rule}`,
    });
    addText(slide, label, cx - 60, 432, 120, 24, {
      size: 15,
      bold: true,
      color: color === C.dark ? C.card : C.ink,
      align: "center",
      valign: "middle",
    });
    if (i < nodes.length - 1) {
      addShape(slide, "rightArrow", cx + 82, 431, 58, 26, {
        fill: i === 2 ? C.lime : C.card,
        line: `1.3px ${C.rule}`,
      });
    }
  });
  addShape(slide, "rect", 754, 399, 156, 13, { fill: C.lime, line: `1px ${C.rule}` });
  addText(slide, "Sustainability comes from solving continuation for students and visibility for institutions.", 178, 572, 930, 30, {
    typeface: FONT_HEAD,
    size: 20,
    bold: true,
    align: "center",
  });
  addText(slide, "Curated trust-and-continuation first; expand into milestone-based backer support.", 248, 607, 780, 22, {
    size: 14,
    color: C.muted,
    align: "center",
  });
  return slide;
}

export function slide08(presentation) {
  const slide = baseSlide(presentation);
  header(slide, "Sustainable growth");
  addText(slide, "Launch signal", 946, 82, 150, 18, { size: 12, bold: true, color: C.muted, align: "right" });
  pill(slide, "DVF verdict: strong opportunity", 908, 106, 236, { fill: C.limeSoft, h: 32 });
  addShape(slide, "roundRect", 112, 160, 1012, 238, {
    fill: C.warm,
    line: `1.5px ${C.rule}`,
  });
  progressBar(slide, "Protected ideas", 174, 230, 840, C.orange, { level: 0.58 });
  progressBar(slide, "Mentor validation", 174, 300, 840, C.blue, { level: 0.7 });
  progressBar(slide, "Milestone funding", 174, 370, 840, C.lime, { level: 0.48 });
  const cards = [
    ["More trusted records", "Version history and proof of creation become reusable evidence.", C.orange],
    ["More useful mentor signal", "Structured feedback helps projects improve and qualify.", C.blue],
    ["More investable projects", "Milestone readiness creates a clearer support path.", C.lime],
  ];
  cards.forEach(([title, body, color], i) => {
    cardTitle(slide, title, body, 112 + i * 346, 462, 288, 126, {
      accent: color,
      titleSize: 19,
      bodySize: 12.5,
      shadowOffset: 3,
    });
  });
  return slide;
}

export function slide09(presentation) {
  const slide = baseSlide(presentation, { dark: true, bg: C.bg });
  header(slide, "Each chain compounds", { dark: true });
  const cx = 356;
  const cy = 342;
  const r = 135;
  const pts = [
    [cx, cy - r, "Proof", C.lime],
    [cx + r, cy, "Validation", C.blue],
    [cx, cy + r, "Access", C.orange],
    [cx - r, cy, "Funding", C.mint],
  ];
  addShape(slide, "ellipse", cx - 160, cy - 160, 320, 320, {
    fill: "none",
    line: `2px dotted #EAE8DD`,
  });
  pts.forEach(([x, y, label, color], i) => {
    const [nx, ny] = pts[(i + 1) % pts.length];
    addLine(slide, x, y, nx, ny, { width: 2, style: "dotted", color: "#DAD8CF" });
    addShape(slide, "ellipse", x - 30, y - 30, 60, 60, {
      fill: color,
      line: `2px ${C.card}`,
    });
    addText(slide, label, x - 58, y + 42, 116, 22, {
      size: 13,
      bold: true,
      color: C.card,
      align: "center",
    });
  });
  addText(slide, "Chain of continuation", cx - 102, cy - 24, 204, 52, {
    typeface: FONT_HEAD,
    size: 22,
    bold: true,
    color: C.card,
    align: "center",
    valign: "middle",
  });

  const lines = [
    "Proof improves validation.",
    "Validation improves access.",
    "Access improves funding.",
    "Funding improves continuation.",
  ];
  lines.forEach((line, i) => {
    addShape(slide, "roundRect", 676, 180 + i * 78, 420, 52, {
      fill: C.dark2,
      line: `1.2px #EAE8DD`,
    });
    addShape(slide, "ellipse", 694, 197 + i * 78, 18, 18, {
      fill: pts[i][3],
      line: "none",
    });
    addText(slide, line, 728, 190 + i * 78, 330, 30, {
      size: 20,
      bold: true,
      color: C.card,
      valign: "middle",
    });
  });
  addShape(slide, "roundRect", 164, 582, 952, 48, {
    fill: C.lime,
    line: `1.6px ${C.card}`,
  });
  addText(slide, "Continuation becomes the network effect.", 184, 592, 912, 28, {
    typeface: FONT_HEAD,
    size: 24,
    bold: true,
    color: C.ink,
    align: "center",
    valign: "middle",
  });
  return slide;
}

export function slide10(presentation) {
  const slide = baseSlide(presentation);
  header(slide, "Before and after");
  softCard(slide, 98, 152, 492, 408, {
    fill: C.warm,
    outline: C.rule,
    shadowOffset: 5,
  });
  softCard(slide, 690, 152, 492, 408, {
    fill: C.dark,
    outline: C.rule,
    shadowOffset: 5,
  });
  addText(slide, "Before", 132, 184, 190, 40, {
    typeface: FONT_HEAD,
    size: 32,
    bold: true,
  });
  addText(slide, "After", 724, 184, 190, 40, {
    typeface: FONT_HEAD,
    size: 32,
    bold: true,
    color: C.card,
  });
  addShape(slide, "roundRect", 958, 180, 142, 34, {
    fill: C.lime,
    line: `1.4px ${C.card}`,
  });
  addText(slide, "Protected", 972, 188, 114, 18, {
    size: 13,
    bold: true,
    color: C.ink,
    align: "center",
  });
  const before = ["Scattered documents", "Unclear ownership", "No permission layer", "Weak follow-up"];
  const after = ["Protected record", "Ownership proof", "Controlled access", "Mentor validation", "Milestone readiness"];
  before.forEach((item, i) => {
    const y = 256 + i * 54;
    addShape(slide, "ellipse", 132, y + 7, 13, 13, { fill: C.orange, line: `1px ${C.rule}` });
    addText(slide, item, 160, y, 310, 26, { size: 20, bold: true, color: C.ink });
  });
  after.forEach((item, i) => {
    const y = 248 + i * 48;
    checkMark(slide, 724, y + 3, { color: C.lime, width: 2.5 });
    addText(slide, item, 768, y, 320, 28, { size: 20, bold: true, color: C.card });
  });
  iconDoc(slide, 456, 244, { w: 44, h: 54, fill: C.card });
  iconDoc(slide, 488, 282, { w: 44, h: 54, fill: C.card });
  iconDoc(slide, 438, 326, { w: 44, h: 54, fill: C.card });
  addLine(slide, 444, 410, 536, 300, { width: 1.5, style: "dotted", color: C.muted });
  iconShield(slide, 1082, 420, { fill: C.lime, line: C.card, check: C.card });
  pill(slide, "Proof", 228, 594, 110, { fill: C.card, h: 32 });
  pill(slide, "Access", 386, 594, 118, { fill: C.card, h: 32 });
  pill(slide, "Signal", 544, 594, 116, { fill: C.card, h: 32 });
  pill(slide, "Funding", 704, 594, 132, { fill: C.limeSoft, h: 32 });
  addText(slide, "From post-hackathon drop-off to curated continuation.", 860, 590, 280, 42, {
    size: 14,
    bold: true,
    color: C.muted,
    align: "right",
  });
  return slide;
}
