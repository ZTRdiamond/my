const _marker_global = 38; /* '&' */
const _marker_route = 38; /* '&' */
const _marker_response = 60; /* '<' */
const _marker_define_reference = 35; /* '#' */
const _marker_reference = 64; /* '@' */

const _minMarkerLen_route = 2;
const _minMarkerLen_response = 2;
const _minMarkerLen_define_reference = 2;
const _minMarkerLen_reference = 2;

const _types_route = ["GET", "POST", "DELETE", "PATCH", "PUT"];

function copyToken(token, TokenConstructor) {
  const copyt = new TokenConstructor(token.type, token.tag, token.nesting);
  copyt.content = token.content;
  copyt.tag = token.tag;
  copyt.attrs = token.attrs ? token.attrs.map(attr => [...attr]) : null;
  copyt.map = token.map ? [...token.map] : null;
  copyt.level = token.level;
  
  if (token.children) {
    copyt.children = token.children.map(child => copyToken(child, TokenConstructor));
  } else {
    copyt.children = null;
  }
  
  copyt.markup = token.markup;
  copyt.info = token.info;
  copyt.meta = token.meta;
  copyt.block = token.block;
  copyt.hidden = token.hidden;
  return copyt;
}

export default function MarkdownItDOKAPI(md) {
  md.block.ruler.after("fence", "dokapi_define_reference", dokapiDefineReference);
  md.block.ruler.after("fence", "dokapi_reference", dokapiReference);
  md.block.ruler.after("fence", "dokapi_route", dokapiRoute);
  md.block.ruler.after("fence", "dokapi_response", dokapiResponse);
  md.core.ruler.after("block", "dokapi_apply_reference", dokapiCoreApplyReference);

  // Route Renderers
  md.renderer.rules["dokapi_route_open"] = renderRoute;
  md.renderer.rules["dokapi_route_details_open"] = renderRoute;
  md.renderer.rules["dokapi_route_summary_open"] = renderRoute;
  md.renderer.rules["dokapi_route_title_open"] = renderRoute;
  md.renderer.rules["dokapi_route_verb_open"] = renderRoute;
  md.renderer.rules["dokapi_route_verb_close"] = renderRoute;
  md.renderer.rules["dokapi_route_path_open"] = renderRoute;
  md.renderer.rules["dokapi_route_path_close"] = renderRoute;
  md.renderer.rules["dokapi_route_description_open"] = renderRoute;
  md.renderer.rules["dokapi_route_description_close"] = renderRoute;
  md.renderer.rules["dokapi_route_title_close"] = renderRoute;
  md.renderer.rules["dokapi_route_summary_close"] = renderRoute;
  md.renderer.rules["dokapi_route_details_close"] = renderRoute;
  md.renderer.rules["dokapi_route_close"] = renderRoute;

  // Response Renderers
  md.renderer.rules["dokapi_response_open"] = renderResponse;
  md.renderer.rules["dokapi_response_details_open"] = renderResponse;
  md.renderer.rules["dokapi_response_summary_open"] = renderResponse;
  md.renderer.rules["dokapi_response_title_open"] = renderResponse;
  md.renderer.rules["dokapi_response_status_open"] = renderResponse;
  md.renderer.rules["dokapi_response_status_close"] = renderResponse;
  md.renderer.rules["dokapi_response_message_open"] = renderResponse;
  md.renderer.rules["dokapi_response_message_close"] = renderResponse;
  md.renderer.rules["dokapi_response_title_close"] = renderResponse;
  md.renderer.rules["dokapi_response_summary_close"] = renderResponse;
  md.renderer.rules["dokapi_response_details_close"] = renderResponse;
  md.renderer.rules["dokapi_response_close"] = renderResponse;
}

function dokapiDefineReference(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  const max = state.eMarks[startLine];
  let marker = state.src.charCodeAt(pos);
  if (marker !== _marker_global) return false;

  const mem = pos;
  if (_marker_define_reference === _marker_global) {
    pos = state.skipChars(pos, marker);
    const len = pos - mem;
    if (len < _minMarkerLen_define_reference + 1) return false;
  } else {
    pos = state.skipChars(pos, marker);
    marker = state.src.charCodeAt(pos);
    if (marker !== _marker_define_reference) return false;
    pos = state.skipChars(pos, marker);
    const len = pos - mem;
    if (len < _minMarkerLen_define_reference) return false;
  }

  const params = state.src.slice(pos, max).trim().split(" ");
  const refname = params.shift();

  if (!refname) return false;
  if (silent) return true;

  const oldParent = state.parentType;
  const oldLineMax = state.lineMax;
  const oldIndent = state.blkIndent;

  state.blkIndent += 4;

  let nextLine = startLine;
  while (true) {
    nextLine++;
    if (nextLine >= endLine) break;
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    const lineMax = state.eMarks[nextLine];

    if (pos < lineMax && state.sCount[nextLine] < state.blkIndent) {
      break;
    }
  }

  state.parentType = "dokapi";
  state.lineMax = nextLine;

  let token = state.push("dokapi_reference_open", "", 0);
  token.map = [startLine, nextLine];
  token.info = refname;
  token.block = false;

  state.md.block.tokenize(state, startLine + 1, nextLine);

  token = state.push("dokapi_reference_close", "", 0);
  token.map = [startLine, nextLine];
  token.block = false;

  state.parentType = oldParent;
  state.lineMax = oldLineMax;
  state.line = nextLine;
  state.blkIndent = oldIndent;
  return true;
}

function dokapiReference(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  const max = state.eMarks[startLine];
  let marker = state.src.charCodeAt(pos);
  if (marker !== _marker_global) return false;

  const mem = pos;
  if (_marker_reference === _marker_global) {
    pos = state.skipChars(pos, marker);
    const len = pos - mem;
    if (len < _minMarkerLen_reference + 1) return false;
  } else {
    pos = state.skipChars(pos, marker);
    marker = state.src.charCodeAt(pos);
    if (marker !== _marker_reference) return false;
    pos = state.skipChars(pos, marker);
    const len = pos - mem;
    if (len < _minMarkerLen_reference) return false;
  }

  const params = state.src.slice(pos, max).trim().split(" ");
  const refname = params.shift();

  if (!refname) return false;
  if (silent) return true;

  state.line = startLine + 1;

  const token = state.push("dokapi_reference", "", 0);
  token.info = refname;
  token.block = false;
  token.map = [startLine, state.line];

  return true;
}

function dokapiCoreApplyReference(state) {
  const refs = new Map();
  let currentrefname = "";
  let active = false;

  for (const token of state.tokens) {
    if (token.type === "dokapi_reference_open") {
      active = true;
      currentrefname = token.info;
      refs.set(token.info, []);
      continue;
    }
    if (token.type === "dokapi_reference_close") {
      active = false;
      currentrefname = "";
    }

    if (active) {
      const tokens = refs.get(currentrefname);
      if (tokens) tokens.push(token);
    }
  }

  for (let i = 0; i < state.tokens.length; i++) {
    if (state.tokens[i].type === "dokapi_reference") {
      const tokens = refs.get(state.tokens[i].info);
      if (!tokens) break;

      const copiedTokens = tokens.map(t => copyToken(t, state.Token));
      state.tokens.splice(i + 1, 0, ...copiedTokens);
    }
  }

  state.tokens = state.tokens.filter(
    token =>
      token.type !== "dokapi_reference" &&
      token.type !== "dokapi_reference_open" &&
      token.type !== "dokapi_reference_close"
  );
}

function getRouteContext(verb) {
  switch (verb.toUpperCase()) {
    case "GET":
      return { alertClass: "alert--info", badgeClass: "badge--info" };
    case "POST":
      return { alertClass: "alert--success", badgeClass: "badge--success" };
    case "PUT":
    case "PATCH":
      return { alertClass: "alert--warning", badgeClass: "badge--warning" };
    case "DELETE":
      return { alertClass: "alert--danger", badgeClass: "badge--danger" };
    default:
      return { alertClass: "alert--secondary", badgeClass: "badge--secondary" };
  }
}

function renderRoute(tokens, idx, _options, env, self) {
  const token = tokens[idx];
  const verb = token.info || "";
  const { alertClass, badgeClass } = getRouteContext(verb);

  if (token.type === "dokapi_route_open") {
    token.attrJoin("class", "dokapi-route-container margin-bottom--md");
  } else if (token.type === "dokapi_route_details_open") {
    token.attrJoin("class", `alert ${alertClass} dokapi-details`);
  } else if (token.type === "dokapi_route_summary_open") {
    token.attrJoin("class", "dokapi-summary");
  } else if (token.type === "dokapi_route_title_open") {
    token.attrJoin("class", "dokapi-title-row");
  } else if (token.type === "dokapi_route_verb_open") {
    token.attrJoin("class", `badge ${badgeClass} dokapi-verb`);
  } else if (token.type === "dokapi_route_path_open") {
    token.attrJoin("class", "dokapi-path");
  } else if (token.type === "dokapi_route_description_open") {
    token.attrJoin("class", "dokapi-description margin-left--sm text--muted");
  }
  return self.renderToken(tokens, idx, _options);
}

function dokapiRoute(state, startLine, endLine, silent) {
  if (state.tShift[startLine] - state.blkIndent >= 4) return false;
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  let marker = state.src.charCodeAt(pos);
  if (marker !== _marker_global) return false;

  const mem = pos;
  if (_marker_route === _marker_global) {
    pos = state.skipChars(pos, marker);
    const len = pos - mem;
    if (len < _minMarkerLen_route + 1) return false;
  } else {
    pos = state.skipChars(pos, marker);
    marker = state.src.charCodeAt(pos);
    if (marker !== _marker_route) return false;
    pos = state.skipChars(pos, marker);
    const len = pos - mem;
    if (len < _minMarkerLen_route) return false;
  }

  const markup = state.src.slice(mem, pos);
  const params = state.src.slice(pos, max).trim().split(" ");

  const verb = params.shift();
  const path = params.shift();
  const description = params.join(" ");

  if (!verb || _types_route.indexOf(verb) < 0) return false;
  if (silent) return true;

  const oldParent = state.parentType;
  const oldLineMax = state.lineMax;
  const oldIndent = state.blkIndent;

  state.blkIndent += 4;

  let nextLine = startLine;
  while (true) {
    nextLine++;
    if (nextLine >= endLine) break;
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos < max && state.sCount[nextLine] < state.blkIndent) {
      break;
    }
  }

  state.parentType = "dokapi";
  state.lineMax = nextLine;

  let token = state.push("dokapi_route_open", "div", 1);
  token.markup = markup;
  token.block = true;
  token.info = verb;
  token.map = [startLine, startLine + 1];

  token = state.push("dokapi_route_details_open", "details", 1);
  token.block = true;
  token.info = verb;
  token.map = [startLine, startLine + 1];

  token = state.push("dokapi_route_summary_open", "summary", 1);
  token.block = true;
  token.map = [startLine, startLine + 1];

  token = state.push("dokapi_route_title_open", "div", 1);
  token.block = true;
  token.map = [startLine, startLine + 1];

  token = state.push("dokapi_route_verb_open", "span", 1);
  token.block = true;
  token.info = verb;
  token.map = [startLine, startLine + 1];

  token = state.push("inline", "", 0);
  token.content = verb;
  token.map = [startLine, startLine + 1];
  token.children = [];

  token = state.push("dokapi_route_verb_close", "span", -1);
  token.map = [startLine, nextLine];
  token.block = true;

  token = state.push("dokapi_route_path_open", "code", 1);
  token.block = true;
  token.map = [startLine, startLine + 1];

  token = state.push("inline", "", 0);
  token.content = path || "";
  token.map = [startLine, startLine + 1];
  token.children = [];

  token = state.push("dokapi_route_path_close", "code", -1);
  token.map = [startLine, nextLine];
  token.block = true;

  if (description) {
    token = state.push("dokapi_route_description_open", "span", 1);
    token.block = true;
    token.map = [startLine, startLine + 1];

    token = state.push("inline", "", 0);
    token.content = description;
    token.map = [startLine, startLine + 1];
    token.children = [];

    token = state.push("dokapi_route_description_close", "span", -1);
    token.map = [startLine, nextLine];
    token.block = true;
  }

  token = state.push("dokapi_route_title_close", "div", -1);
  token.map = [startLine, nextLine];
  token.block = true;

  token = state.push("dokapi_route_summary_close", "summary", -1);
  token.map = [startLine, nextLine];
  token.block = true;

  state.md.block.tokenize(state, startLine + 1, nextLine);

  token = state.push("dokapi_route_details_close", "details", -1);
  token.map = [startLine, nextLine];
  token.block = true;

  token = state.push("dokapi_route_close", "div", -1);
  token.markup = markup;
  token.map = [startLine, nextLine];
  token.block = true;

  state.parentType = oldParent;
  state.lineMax = oldLineMax;
  state.line = nextLine;
  state.blkIndent = oldIndent;
  return true;
}

function renderResponse(tokens, idx, _options, env, self) {
  const token = tokens[idx];
  const responseclass = token.info || "";
  const alertClass = responseclass === "success" ? "alert--success" : "alert--danger";
  const badgeClass = responseclass === "success" ? "badge--success" : "badge--danger";

  if (token.type === "dokapi_response_open") {
    token.attrJoin("class", "dokapi-response-container margin-bottom--md");
  } else if (token.type === "dokapi_response_details_open") {
    token.attrJoin("class", `alert ${alertClass} dokapi-details`);
  } else if (token.type === "dokapi_response_summary_open") {
    token.attrJoin("class", "dokapi-summary");
  } else if (token.type === "dokapi_response_title_open") {
    token.attrJoin("class", "dokapi-title-row");
  } else if (token.type === "dokapi_response_status_open") {
    token.attrJoin("class", `badge ${badgeClass} dokapi-status`);
  } else if (token.type === "dokapi_response_message_open") {
    token.attrJoin("class", "dokapi-message margin-left--sm text--muted");
  }
  return self.renderToken(tokens, idx, _options);
}

function dokapiResponse(state, startLine, endLine, silent) {
  if (state.tShift[startLine] - state.blkIndent >= 4) return false;
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  let marker = state.src.charCodeAt(pos);
  if (marker !== _marker_global) return false;

  const mem = pos;
  if (_marker_response === _marker_global) {
    pos = state.skipChars(pos, marker);
    const len = pos - mem;
    if (len < _minMarkerLen_response + 1) return false;
  } else {
    pos = state.skipChars(pos, marker);
    marker = state.src.charCodeAt(pos);
    if (marker !== _marker_response) return false;
    pos = state.skipChars(pos, marker);
    const len = pos - mem;
    if (len < _minMarkerLen_response) return false;
  }

  const markup = state.src.slice(mem, pos);
  const params = state.src.slice(pos, max).trim().split(" ");

  const status = params.shift();
  let message = "";
  let responseclass = "";

  if (!status) return false;

  if (/2\d{2}/.test(status)) {
    message = "OK";
    responseclass = "success";
  } else {
    message = params.join(" ");
    responseclass = "error";
  }

  if (silent) return true;

  const oldParent = state.parentType;
  const oldLineMax = state.lineMax;
  const oldIndent = state.blkIndent;

  state.blkIndent += 4;

  let nextLine = startLine;
  while (true) {
    nextLine++;
    if (nextLine >= endLine) break;
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos < max && state.sCount[nextLine] < state.blkIndent) {
      break;
    }
  }

  state.parentType = "dokapi";
  state.lineMax = nextLine;

  let token = state.push("dokapi_response_open", "div", 1);
  token.markup = markup;
  token.block = true;
  token.info = responseclass;
  token.map = [startLine, startLine + 1];

  token = state.push("dokapi_response_details_open", "details", 1);
  token.block = true;
  token.info = responseclass;
  token.map = [startLine, startLine + 1];

  token = state.push("dokapi_response_summary_open", "summary", 1);
  token.block = true;
  token.map = [startLine, startLine + 1];

  token = state.push("dokapi_response_title_open", "div", 1);
  token.block = true;
  token.map = [startLine, startLine + 1];

  token = state.push("dokapi_response_status_open", "span", 1);
  token.block = true;
  token.info = responseclass;
  token.map = [startLine, startLine + 1];

  token = state.push("inline", "", 0);
  token.content = status;
  token.map = [startLine, startLine + 1];
  token.children = [];

  token = state.push("dokapi_response_status_close", "span", -1);
  token.map = [startLine, nextLine];
  token.block = true;

  token = state.push("dokapi_response_message_open", "span", 1);
  token.block = true;
  token.map = [startLine, startLine + 1];

  token = state.push("inline", "", 0);
  token.content = message;
  token.map = [startLine, startLine + 1];
  token.children = [];

  token = state.push("dokapi_response_message_close", "span", -1);
  token.map = [startLine, nextLine];
  token.block = true;

  token = state.push("dokapi_response_title_close", "div", -1);
  token.map = [startLine, nextLine];
  token.block = true;

  token = state.push("dokapi_response_summary_close", "summary", -1);
  token.map = [startLine, nextLine];
  token.block = true;

  state.md.block.tokenize(state, startLine + 1, nextLine);

  token = state.push("dokapi_response_details_close", "details", -1);
  token.map = [startLine, nextLine];
  token.block = true;

  token = state.push("dokapi_response_close", "div", -1);
  token.markup = markup;
  token.map = [startLine, nextLine];
  token.block = true;

  state.parentType = oldParent;
  state.lineMax = oldLineMax;
  state.line = nextLine;
  state.blkIndent = oldIndent;
  return true;
}