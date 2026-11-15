"""VOICEVOX CORE（Python）で台本を春日部つむぎの声で音声化する。
VOICEVOX ENGINE を起動せずに使える版。
  python tts_core.py <voicevox_dir> <lines.json> <outdir> <voice.json>
"""
import json, sys, wave, io
from pathlib import Path
from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile

base, lines_path, outdir, manifest = map(Path, sys.argv[1:5])
STYLE = 8  # 春日部つむぎ ノーマル（0.vvm）
ort = Onnxruntime.load_once(filename=str(base / "voicevox_onnxruntime-linux-x64-1.17.3/lib/libvoicevox_onnxruntime.so.1.17.3"))
syn = Synthesizer(ort, OpenJtalk(str(base / "open_jtalk_dic_utf_8-1.11")))
with VoiceModelFile.open(str(base / "vvm/vvms/0.vvm")) as m:
    syn.load_voice_model(m)

outdir.mkdir(parents=True, exist_ok=True)
durations = {}
for line in json.loads(lines_path.read_text()):
    text = line.get("speak") or line["text"]
    q = syn.create_audio_query(text, STYLE)
    q.speed_scale = 1.15
    q.intonation_scale = 1.25
    q.pre_phoneme_length = 0.05
    q.post_phoneme_length = 0.12
    wav = syn.synthesis(q, STYLE)
    (outdir / f"{line['id']}.wav").write_bytes(wav)
    with wave.open(io.BytesIO(wav)) as w:
        durations[line["id"]] = round(w.getnframes() / w.getframerate(), 3)
    print(line["id"], durations[line["id"]], text, flush=True)

manifest.write_text(json.dumps({"hasAudio": True, "durations": durations}, ensure_ascii=False, indent=2))
