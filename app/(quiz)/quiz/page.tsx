'use client';

import { useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { GripVertical, ArrowRight, Check, Loader2 } from "lucide-react";
import { QuizShell } from "@/components/quiz/QuizShell";
import { QuestionSlider } from "@/components/quiz/QuestionSlider";
import { QuestionSelect } from "@/components/quiz/QuestionSelect";
import { QuestionText } from "@/components/quiz/QuestionText";
import { Button } from "@/components/ui/Button";
import { ARENAS } from "@/lib/constants/arenas";
import { VALUES } from "@/lib/constants/values";
import { cn } from "@/lib/utils";
import type { QuizState, RankedValue } from "@/types/quiz";

type LocalQuizState = QuizState & { valuesSelected: string[] };

type Action =
  | { type: "SET_ARENA_SCORE"; key: keyof QuizState["arenaScores"]; value: number }
  | { type: "SET_VALUES_SELECTED"; value: string[] }
  | { type: "SET_VALUES_RANKED"; value: RankedValue[] }
  | { type: "SET_SACRIFICE"; value: string }
  | { type: "SET_ENVY"; value: string }
  | { type: "SET_PERMISSION"; value: "A" | "B" | "C" | "D" }
  | { type: "SET_DEFERRED_DREAM"; value: boolean }
  | { type: "SET_DEFERRED_CATEGORY"; value: string | null }
  | { type: "SET_DEFERRED_OTHER"; value: string }
  | { type: "SET_INFLUENCE"; value: string }
  | { type: "SET_FUTURE_VISION"; value: string }
  | { type: "SET_CONTACT"; firstName: string; email: string }
  | { type: "TOGGLE_NEWSLETTER" }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_STEP"; value: number };

const initialState: LocalQuizState = {
  currentStep: 0,
  totalSteps: 15,
  arenaScores: {},
  valuesSelected: [],
  valuesRanked: [],
  sacrificeFirst: null,
  envySignal: null,
  permissionOrientation: null,
  deferredDream: null,
  deferredDreamCategory: null,
  deferredDreamOther: "",
  influenceSource: null,
  futureVision: "",
  firstName: "",
  email: "",
  newsletterOptIn: true
};

function reducer(state: LocalQuizState, action: Action): LocalQuizState {
  switch (action.type) {
    case "SET_ARENA_SCORE":
      return { ...state, arenaScores: { ...state.arenaScores, [action.key]: action.value } };
    case "SET_VALUES_SELECTED":
      return { ...state, valuesSelected: action.value };
    case "SET_VALUES_RANKED":
      return { ...state, valuesRanked: action.value };
    case "SET_SACRIFICE":
      return { ...state, sacrificeFirst: action.value };
    case "SET_ENVY":
      return { ...state, envySignal: action.value };
    case "SET_PERMISSION":
      return { ...state, permissionOrientation: action.value };
    case "SET_DEFERRED_DREAM":
      return {
        ...state,
        deferredDream: action.value,
        deferredDreamCategory: action.value ? state.deferredDreamCategory : null,
        deferredDreamOther: action.value ? state.deferredDreamOther : ""
      };
    case "SET_DEFERRED_CATEGORY":
      return { ...state, deferredDreamCategory: action.value };
    case "SET_DEFERRED_OTHER":
      return { ...state, deferredDreamOther: action.value };
    case "SET_INFLUENCE":
      return { ...state, influenceSource: action.value };
    case "SET_FUTURE_VISION":
      return { ...state, futureVision: action.value };
    case "SET_CONTACT":
      return { ...state, firstName: action.firstName, email: action.email };
    case "TOGGLE_NEWSLETTER":
      return { ...state, newsletterOptIn: !state.newsletterOptIn };
    case "NEXT_STEP":
      return { ...state, currentStep: Math.min(16, state.currentStep + 1) };
    case "PREV_STEP":
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) };
    case "SET_STEP":
      return { ...state, currentStep: action.value };
    default:
      return state;
  }
}

function SortableRankCard({
  id,
  label,
  rank
}: {
  id: string;
  label: string;
  rank: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${isDragging ? 1.02 : 1})`
      : undefined,
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex cursor-grab items-center gap-3 rounded-2xl border border-brand-rule bg-brand-cream px-4 py-3 active:cursor-grabbing",
        isDragging ? "shadow-strong" : "shadow-none"
      )}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-amber text-sm text-white">
        {rank}
      </span>
      <span className="flex-1 font-medium text-brand-midnight">{label}</span>
      <GripVertical className="h-4 w-4 text-brand-muted" />
    </div>
  );
}

export default function QuizPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [valuesStage, setValuesStage] = useState<"select" | "rank">("select");
  const [contactErrors, setContactErrors] = useState<{ firstName?: string; email?: string; submit?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const directionRef = useRef<1 | -1>(1);
  const router = useRouter();

  const sensors = useSensors(useSensor(PointerSensor));

  const goNext = () => {
    directionRef.current = 1;
    dispatch({ type: "NEXT_STEP" });
  };

  const goBack = () => {
    directionRef.current = -1;
    if (state.currentStep === 9 && valuesStage === "rank") {
      setValuesStage("select");
      return;
    }
    dispatch({ type: "PREV_STEP" });
  };

  const setStep = (step: number) => {
    directionRef.current = step > state.currentStep ? 1 : -1;
    dispatch({ type: "SET_STEP", value: step });
  };

  const saveRankedValues = (keys: string[]) => {
    const ranked = keys
      .map((key, index) => {
        const value = VALUES.find((item) => item.key === key);
        if (!value) return null;
        return { key: value.key, label: value.label, rank: (index + 1) as 1 | 2 | 3 | 4 };
      })
      .filter(Boolean) as RankedValue[];
    dispatch({ type: "SET_VALUES_RANKED", value: ranked });
  };

  const reorderRankedValues = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = state.valuesRanked.findIndex((item) => item.key === active.id);
    const newIndex = state.valuesRanked.findIndex((item) => item.key === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const moved = arrayMove(state.valuesRanked, oldIndex, newIndex).map((item, index) => ({
      ...item,
      rank: (index + 1) as 1 | 2 | 3 | 4
    }));
    dispatch({ type: "SET_VALUES_RANKED", value: moved });
  };

  const handleSubmit = async () => {
    const firstName = state.firstName.trim();
    const email = state.email.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const errors: { firstName?: string; email?: string } = {};
    if (!firstName) errors.firstName = "First name is required.";
    if (!email) errors.email = "Email is required.";
    else if (!emailValid) errors.email = "Please enter a valid email.";

    if (Object.keys(errors).length) {
      setContactErrors(errors);
      return;
    }

    setContactErrors({});
    setIsSubmitting(true);
    try {
      const params =
        typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();

      const payload = {
        firstName,
        email,
        newsletterOptIn: state.newsletterOptIn,
        arenaScores: state.arenaScores,
        valuesRanked: state.valuesRanked,
        sacrificeFirst: state.sacrificeFirst,
        envySignal: state.envySignal,
        permissionOrientation: state.permissionOrientation,
        deferredDream: state.deferredDream,
        deferredDreamCategory: state.deferredDreamCategory,
        deferredDreamOther: state.deferredDreamOther,
        influenceSource: state.influenceSource,
        futureVision: state.futureVision,
        utmSource: params.get("utm_source"),
        utmMedium: params.get("utm_medium"),
        utmCampaign: params.get("utm_campaign"),
        referrer: typeof document !== "undefined" ? document.referrer : null
      };

      const response = await fetch("/api/submit-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Unable to submit right now.");
      const data = (await response.json()) as { id: string };
      router.push(`/result/${data.id}`);
    } catch (error) {
      setContactErrors({
        submit: error instanceof Error ? error.message : "Something went wrong. Please try again."
      });
      setIsSubmitting(false);
    }
  };

  const showBack = state.currentStep > 0;

  const stepContent = (() => {
    if (state.currentStep === 0) {
      return (
        <div className="rounded-3xl border border-brand-rule bg-white p-8 text-center shadow-soft">
          <p className="text-3xl">🧭</p>
          <h1 className="mt-4 font-display text-4xl text-brand-midnight">A few honest questions.</h1>
          <p className="mt-4 text-balance leading-relaxed text-brand-muted">
            There are no right answers here, only your answers. The score you get at the end is only as
            accurate as the honesty you bring to the next 5 minutes.
          </p>
          <p className="mt-4 text-sm text-brand-muted">15 questions · Takes about 5 minutes</p>
          <Button size="lg" fullWidth className="mt-8" onClick={() => setStep(1)} showArrow>
            Let&apos;s find out
          </Button>
        </div>
      );
    }

    if (state.currentStep >= 1 && state.currentStep <= 8) {
      const arena = ARENAS[state.currentStep - 1];
      const value = state.arenaScores[arena.key] ?? null;
      return (
        <QuestionSlider
          question={arena.question}
          scaleMin={arena.scaleMin}
          scaleMax={arena.scaleMax}
          value={value}
          onChange={(next) => dispatch({ type: "SET_ARENA_SCORE", key: arena.key, value: next })}
          onNext={goNext}
          nextLabel="Next"
        />
      );
    }

    if (state.currentStep === 9) {
      if (valuesStage === "select") {
        const count = state.valuesSelected.length;
        return (
          <div className="rounded-3xl border border-brand-rule bg-white p-6 shadow-soft md:p-8">
            <h2 className="text-balance font-display text-[30px] leading-tight text-brand-midnight">
              Which of these feel most like the core of who you are?
            </h2>
            <p className="mt-2 text-brand-muted">Pick exactly 4.</p>
            <p className={cn("mt-4 text-sm", count ? "text-brand-amber" : "text-brand-muted")}>
              {count} of 4 selected
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {VALUES.map((item) => {
                const selected = state.valuesSelected.includes(item.key);
                const atLimit = state.valuesSelected.length >= 4;
                const dim = atLimit && !selected;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      if (selected) {
                        dispatch({
                          type: "SET_VALUES_SELECTED",
                          value: state.valuesSelected.filter((key) => key !== item.key)
                        });
                        return;
                      }
                      if (atLimit) {
                        dispatch({
                          type: "SET_VALUES_SELECTED",
                          value: [...state.valuesSelected.slice(1), item.key]
                        });
                        return;
                      }
                      dispatch({
                        type: "SET_VALUES_SELECTED",
                        value: [...state.valuesSelected, item.key]
                      });
                    }}
                    className={cn(
                      "flex min-h-14 items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all",
                      selected
                        ? "border-brand-amber bg-brand-amber text-white"
                        : "border-brand-rule bg-white text-brand-midnight",
                      dim ? "opacity-40" : "opacity-100"
                    )}
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                    {selected ? <Check className="h-4 w-4" /> : null}
                  </button>
                );
              })}
            </div>
            {state.valuesSelected.length === 4 ? (
              <Button
                size="lg"
                fullWidth
                className="mt-6"
                onClick={() => {
                  saveRankedValues(state.valuesSelected);
                  setValuesStage("rank");
                }}
                showArrow
              >
                Rank these
              </Button>
            ) : null}
          </div>
        );
      }

      const ranked = state.valuesRanked;
      return (
        <div className="rounded-3xl border border-brand-rule bg-white p-6 shadow-soft md:p-8">
          <h2 className="text-balance font-display text-[30px] leading-tight text-brand-midnight">
            Now put them in order.
          </h2>
          <p className="mt-2 text-brand-muted">Drag to rank - #1 is what matters most.</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={reorderRankedValues}>
            <SortableContext items={ranked.map((item) => item.key)} strategy={verticalListSortingStrategy}>
              <motion.div layout className="mt-6 space-y-3">
                {ranked.map((item, index) => (
                  <SortableRankCard key={item.key} id={item.key} label={item.label} rank={index + 1} />
                ))}
              </motion.div>
            </SortableContext>
          </DndContext>
          <button
            type="button"
            className="mt-4 text-sm text-brand-muted hover:text-brand-ink-2"
            onClick={() => setValuesStage("select")}
          >
            ← Change my selections
          </button>
          <Button size="lg" fullWidth className="mt-6" onClick={goNext} showArrow>
            This is my order
          </Button>
        </div>
      );
    }

    if (state.currentStep === 10) {
      return (
        <QuestionSelect
          question="When life gets genuinely busy, what do you sacrifice first, almost automatically?"
          options={[
            { key: "time_myself", label: "Time for myself" },
            { key: "creative_projects", label: "Creative projects" },
            { key: "physical_health", label: "Physical health" },
            { key: "meaningful_work", label: "Meaningful work" },
            { key: "close_relationships", label: "My closest relationships" },
            { key: "fun_spontaneity", label: "Fun and spontaneity" },
            { key: "learning", label: "Learning something new" },
            { key: "sleep_rest", label: "Sleep / rest" }
          ]}
          value={state.sacrificeFirst}
          onChange={(value) => dispatch({ type: "SET_SACRIFICE", value })}
          onNext={goNext}
          autoAdvance
        />
      );
    }

    if (state.currentStep === 11) {
      return (
        <QuestionSelect
          question="When you feel a flicker of envy or admiration for someone else's life, what is it usually about?"
          note="Go with your first instinct."
          options={[
            { key: "freedom_time", label: "Their freedom and how they spend their time" },
            { key: "purpose_impact", label: "Their sense of purpose and impact" },
            { key: "creative_output", label: "Their creative output" },
            { key: "relationship_quality", label: "The quality of their relationships" },
            { key: "financial_independence", label: "Their financial independence" },
            { key: "health_energy", label: "Their health and energy" },
            { key: "sense_of_adventure", label: "Their sense of adventure" },
            { key: "confidence_to_be_themselves", label: "Their confidence to just be themselves" }
          ]}
          value={state.envySignal}
          onChange={(value) => dispatch({ type: "SET_ENVY", value })}
          onNext={goNext}
          autoAdvance
        />
      );
    }

    if (state.currentStep === 12) {
      return (
        <QuestionSelect
          question="Which of these feels most true for you right now?"
          note="There's no right answer. Be honest with yourself."
          options={[
            { key: "A", label: "I know what I want, I'm just not sure I'm allowed to want it." },
            {
              key: "B",
              label: "I've been so busy doing the next thing that I've lost track of what I actually want."
            },
            { key: "C", label: "I know what I want and I'm actively working toward it." },
            { key: "D", label: "I want something to change but I honestly don't know what yet." }
          ]}
          value={state.permissionOrientation}
          onChange={(value) => dispatch({ type: "SET_PERMISSION", value: value as "A" | "B" | "C" | "D" })}
          onNext={goNext}
          nextLabel="See my score"
        />
      );
    }

    if (state.currentStep === 13) {
      const categoryOptions = [
        { key: "adventure_travel", label: "✈️ Adventure & Travel" },
        { key: "creative_pursuit", label: "🎨 Creative pursuit" },
        { key: "career_shift", label: "💼 Career or work shift" },
        { key: "deep_learning", label: "📚 Learning something deeply" },
        { key: "relationship_family", label: "❤️ Relationship or family" },
        { key: "health_physical", label: "🏃 Health or physical challenge" },
        { key: "something_else", label: "✨ Something else" }
      ];
      const canProceed =
        state.deferredDream === false ||
        (state.deferredDream === true &&
          !!state.deferredDreamCategory &&
          (state.deferredDreamCategory !== "something_else" || !!state.deferredDreamOther.trim()));

      return (
        <div className="rounded-3xl border border-brand-rule bg-white p-6 shadow-soft md:p-8">
          <h2 className="text-balance font-display text-[30px] leading-tight text-brand-midnight">
            Is there something you&apos;ve always wanted to do, become, or explore that keeps getting
            pushed to &apos;someday&apos;?
          </h2>
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => dispatch({ type: "SET_DEFERRED_DREAM", value: true })}
              className={cn(
                "flex min-h-14 w-full items-center justify-between rounded-2xl border px-4 py-3 text-left",
                state.deferredDream === true
                  ? "border-brand-midnight bg-brand-midnight text-white"
                  : "border-brand-rule bg-white text-brand-midnight"
              )}
            >
              <span>Yes, there&apos;s something</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                dispatch({ type: "SET_DEFERRED_DREAM", value: false });
                setTimeout(() => goNext(), 250);
              }}
              className={cn(
                "min-h-14 w-full rounded-2xl border px-4 py-3 text-left",
                state.deferredDream === false
                  ? "border-brand-midnight bg-brand-midnight text-white"
                  : "border-brand-rule bg-white text-brand-muted"
              )}
            >
              Not really
            </button>
          </div>

          <AnimatePresence initial={false}>
            {state.deferredDream ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="mt-6 text-sm text-brand-muted">What category does it fall into?</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {categoryOptions.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => dispatch({ type: "SET_DEFERRED_CATEGORY", value: option.key })}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-sm",
                        state.deferredDreamCategory === option.key
                          ? "border-brand-amber bg-brand-amber-light text-brand-midnight"
                          : "border-brand-rule"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {state.deferredDreamCategory === "something_else" ? (
                  <input
                    value={state.deferredDreamOther}
                    onFocus={(event) => {
                      setTimeout(
                        () => event.currentTarget.scrollIntoView({ behavior: "smooth", block: "center" }),
                        120
                      );
                    }}
                    onChange={(event) => dispatch({ type: "SET_DEFERRED_OTHER", value: event.target.value })}
                    placeholder="Tell us briefly →"
                    className="input-premium mt-3"
                  />
                ) : null}
              </motion.div>
            ) : null}
          </AnimatePresence>
          <Button size="lg" fullWidth className="mt-6" onClick={goNext} disabled={!canProceed} showArrow>
            Next
          </Button>
        </div>
      );
    }

    if (state.currentStep === 14) {
      return (
        <QuestionSelect
          question="When you imagine the version of your life you're 'supposed' to be living, whose voice is loudest in defining that?"
          options={[
            { key: "parents", label: "My parents / upbringing" },
            { key: "partner_family", label: "My partner or family" },
            { key: "peers", label: "My peers and social circle" },
            { key: "society", label: "Society / culture broadly" },
            {
              key: "past_decisions",
              label: "Decisions I made years ago that I feel locked into now"
            },
            {
              key: "inner_critic",
              label: "My own inner critic - the standards and expectations I hold myself to"
            }
          ]}
          value={state.influenceSource}
          onChange={(value) => dispatch({ type: "SET_INFLUENCE", value })}
          onNext={goNext}
          nextLabel="Almost there"
        />
      );
    }

    if (state.currentStep === 15) {
      return (
        <div>
          <h2 className="text-balance font-display text-[30px] leading-tight text-brand-midnight">
            What&apos;s the #1 thing you&apos;d love to be true one year from now to have your life feel
            genuinely, fully yours?
          </h2>
          <div className="mt-5">
            <QuestionText
              value={state.futureVision}
              onChange={(value) => dispatch({ type: "SET_FUTURE_VISION", value })}
              onNext={goNext}
              onSkip={() => {
                dispatch({ type: "SET_FUTURE_VISION", value: "" });
                goNext();
              }}
              placeholder="Think less about achievements and more about how you'd feel day to day..."
              skipLabel="Skip this one →"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-brand-midnight px-5 py-12 text-white">
        <div className="mx-auto w-full max-w-lg text-center">
          <div className="relative mx-auto h-20 w-20">
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "3px solid rgba(212, 98, 42, 0.15)",
                borderTopColor: "#D4622A",
                borderRightColor: "#D4622A",
                animation: "spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite"
              }}
            />
          </div>
          <h2 className="mt-8 font-display text-4xl">Your Life Alignment Score is ready.</h2>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-white/70">
            Enter your details to see your score, your alignment type, and the #1 area where your life has
            quietly drifted from what matters most to you.
          </p>
          <div className="mt-8 space-y-4 text-left">
            <div>
              <input
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/30"
                placeholder="First name"
                value={state.firstName}
                onFocus={(event) =>
                  setTimeout(
                    () => event.currentTarget.scrollIntoView({ behavior: "smooth", block: "center" }),
                    120
                  )
                }
                onChange={(event) =>
                  dispatch({ type: "SET_CONTACT", firstName: event.target.value, email: state.email })
                }
              />
              {contactErrors.firstName ? <p className="mt-1 text-sm text-brand-amber">{contactErrors.firstName}</p> : null}
            </div>
            <div>
              <input
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/30"
                placeholder="Email address"
                value={state.email}
                onFocus={(event) =>
                  setTimeout(
                    () => event.currentTarget.scrollIntoView({ behavior: "smooth", block: "center" }),
                    120
                  )
                }
                onChange={(event) =>
                  dispatch({ type: "SET_CONTACT", firstName: state.firstName, email: event.target.value })
                }
              />
              {contactErrors.email ? <p className="mt-1 text-sm text-brand-amber">{contactErrors.email}</p> : null}
            </div>
            <label className="flex items-start gap-2 text-sm text-white/85">
              <input
                type="checkbox"
                checked={state.newsletterOptIn}
                onChange={() => dispatch({ type: "TOGGLE_NEWSLETTER" })}
                className="mt-1 accent-brand-amber"
              />
              <span>Send me a free weekly micro-experiment to start closing my gap.</span>
            </label>
            <Button size="lg" fullWidth onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                "Show me my score →"
              )}
            </Button>
            {contactErrors.submit ? <p className="text-sm text-brand-amber">{contactErrors.submit}</p> : null}
            <p className="text-center text-xs text-white/45">
              No spam ever. Just your results and one weekly micro-experiment to close the gap.
              Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    );
  })();

  if (state.currentStep === 16) {
    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${state.currentStep}-${valuesStage}`}
          initial={{ opacity: 0, x: directionRef.current === 1 ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: directionRef.current === 1 ? -40 : 40 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {stepContent}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <QuizShell
      currentStep={state.currentStep}
      totalSteps={state.totalSteps}
      onBack={goBack}
      showBack={showBack && state.currentStep !== 1}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${state.currentStep}-${valuesStage}`}
          initial={{ opacity: 0, x: directionRef.current === 1 ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: directionRef.current === 1 ? -40 : 40 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {stepContent}
        </motion.div>
      </AnimatePresence>
    </QuizShell>
  );
}
