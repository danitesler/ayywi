import { useState } from "react";
import { Button, Card, CardContent, FindBar } from "@danitesler/ayywi/react";

const initial = "Launch day is Thursday. Before the launch, freeze the release branch. After the launch, watch the error dashboard for an hour.";

export default function Example() {
  const [text, setText] = useState(initial);
  const [query, setQuery] = useState("launch");
  const [replacement, setReplacement] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const [current, setCurrent] = useState(1);
  const [open, setOpen] = useState(true);
  const haystack = matchCase ? text : text.toLowerCase();
  const needle = matchCase ? query : query.toLowerCase();
  const matches: number[] = [];
  if (needle) for (let pos = haystack.indexOf(needle); pos !== -1; pos = haystack.indexOf(needle, pos + needle.length)) matches.push(pos);
  const selected = Math.min(current, matches.length);
  const step = (delta: number) => setCurrent((selected - 1 + delta + matches.length) % matches.length + 1);
  const replaceOne = () => {
    const index = matches[selected - 1];
    if (index === undefined) return;
    setText(text.slice(0, index) + replacement + text.slice(index + query.length));
  };
  const replaceAll = () => {
    let result = ""; let from = 0;
    for (const index of matches) { result += text.slice(from, index) + replacement; from = index + query.length; }
    setText(result + text.slice(from));
    setCurrent(1);
  };
  return <Card>
    {open ? <FindBar query={query} onQueryChange={(value) => { setQuery(value); setCurrent(1); }} matchCase={matchCase} onMatchCaseChange={(value) => { setMatchCase(value); setCurrent(1); }} current={selected} total={matches.length} onNext={() => step(1)} onPrevious={() => step(-1)} onClose={() => setOpen(false)} replace replacement={replacement} onReplacementChange={setReplacement} onReplace={replaceOne} onReplaceAll={replaceAll} /> : <Button onClick={() => setOpen(true)}>Find</Button>}
    <CardContent><p>{text}</p></CardContent>
  </Card>;
}
