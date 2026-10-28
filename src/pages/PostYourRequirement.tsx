
import { useState, type FormEvent } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

type EventQuoteFormData = {
  category: string;
  eventType: string;
  name: string;
  eventDate: string;
  venueCity: string;
  budget: string;
  attendees: string;
  email: string;
  mobile: string;
  message: string;
};

const initialForm: EventQuoteFormData = {
  category: "",
  eventType: "",
  name: "",
  eventDate: "",
  venueCity: "",
  budget: "",
  attendees: "",
  email: "",
  mobile: "",
  message: "",
};

const categories = [
  "Music",
  "Corporate",
  "Wedding",
  "Private Party",
  "College Fest",
  "Other",
];

const eventTypes = [
  "Concert",
  "Birthday",
  "Product Launch",
  "Wedding Reception",
  "Corporate Event",
  "College Fest",
  "Other",
];

const cities = [
  "Bengaluru",
  "Mumbai",
  "Delhi",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Jaipur",
  "Goa",
  "Other",
];

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition duration-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20";

const labelClass =
  "mb-2 block text-sm font-medium text-white/80";

function getTodayLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function EventQuoteForm() {
  const [form, setForm] =
    useState<EventQuoteFormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const updateField = (
    field: keyof EventQuoteFormData,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    const mobile = form.mobile.replace(/\D/g, "");

    if (mobile.length !== 10) {
      setErrorMessage(
        "Please enter a valid 10-digit Indian mobile number."
      );
      return;
    }

    if (
      form.eventDate &&
      form.eventDate < getTodayLocalDate()
    ) {
      setErrorMessage(
        "Please select today or a future event date."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await addDoc(collection(db, "PYR queries"), {
        category: form.category.trim(),
        eventType: form.eventType.trim(),
        name: form.name.trim(),
        eventDate: form.eventDate,
        venueCity: form.venueCity.trim(),
        budget: form.budget.trim(),
        attendees: form.attendees.trim(),
        email: form.email.trim().toLowerCase(),
        mobile,
        message: form.message.trim(),

        status: "new",
        source: "event_requirements_form",
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setForm(initialForm);
    } catch (error) {
      console.error(
        "Error saving event enquiry to PYR queries:",
        error
      );

      setErrorMessage(
        "We couldn't submit your enquiry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#09070f] px-4 py-16 text-white sm:px-6 md:py-24">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 -z-10 h-80 w-80 rounded-full bg-purple-700/20 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]"
      />

      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="mb-4 inline-flex rounded-full border border-amber-300/20 bg-amber-300/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
            Let's plan your event
          </span>

          <h2 className="font-playfair text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Fill Requirements for Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500">
              Event
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
            Tell us what you have in mind. Share your
            requirements, and our team will help you find the
            right artist for your occasion.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-2xl shadow-purple-950/30 backdrop-blur-xl">
          <div className="h-1 w-full bg-gradient-to-r from-purple-600 via-amber-300 to-purple-600" />

          {submitted ? (
            <div className="px-6 py-16 text-center sm:px-10">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-8 w-8 text-emerald-300"
                  aria-hidden="true"
                >
                  <path
                    d="m5 12 4 4L19 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h3 className="font-playfair text-2xl font-semibold sm:text-3xl">
                Enquiry Submitted!
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/60">
                Thank you for choosing ArtistManch. Your event
                requirements have been submitted successfully.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setErrorMessage("");
                }}
                className="mt-8 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold transition hover:border-purple-300/50 hover:bg-white/5"
              >
                Submit Another Enquiry
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-8 p-5 sm:p-8 md:p-10"
            >
              {/* Event details */}
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 text-sm font-semibold text-purple-200">
                    01
                  </span>
                  <div>
                    <h3 className="font-playfair text-xl font-semibold">
                      Event Details
                    </h3>
                    <p className="mt-1 text-xs text-white/45">
                      Tell us about the occasion.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="category"
                      className={labelClass}
                    >
                      Event Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={form.category}
                      onChange={(e) =>
                        updateField("category", e.target.value)
                      }
                      className={fieldClass}
                    >
                      <option value="" className="bg-[#15111f]">
                        Select category
                      </option>
                      {categories.map((category) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-[#15111f]"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="eventType"
                      className={labelClass}
                    >
                      Event Type *
                    </label>
                    <select
                      id="eventType"
                      name="eventType"
                      required
                      value={form.eventType}
                      onChange={(e) =>
                        updateField("eventType", e.target.value)
                      }
                      className={fieldClass}
                    >
                      <option value="" className="bg-[#15111f]">
                        Select event type
                      </option>
                      {eventTypes.map((type) => (
                        <option
                          key={type}
                          value={type}
                          className="bg-[#15111f]"
                        >
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="eventDate"
                      className={labelClass}
                    >
                      Event Date *
                    </label>
                    <input
                      id="eventDate"
                      name="eventDate"
                      type="date"
                      required
                      min={getTodayLocalDate()}
                      value={form.eventDate}
                      onChange={(e) =>
                        updateField("eventDate", e.target.value)
                      }
                      className={`${fieldClass} [color-scheme:dark]`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="venueCity"
                      className={labelClass}
                    >
                      Venue City *
                    </label>
                    <select
                      id="venueCity"
                      name="venueCity"
                      required
                      value={form.venueCity}
                      onChange={(e) =>
                        updateField("venueCity", e.target.value)
                      }
                      className={fieldClass}
                    >
                      <option value="" className="bg-[#15111f]">
                        Select city
                      </option>
                      {cities.map((city) => (
                        <option
                          key={city}
                          value={city}
                          className="bg-[#15111f]"
                        >
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="budget"
                      className={labelClass}
                    >
                      Approximate Budget (₹) *
                    </label>
                    <input
                      id="budget"
                      name="budget"
                      type="number"
                      min="1"
                      required
                      placeholder="e.g. 50000"
                      value={form.budget}
                      onChange={(e) =>
                        updateField("budget", e.target.value)
                      }
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="attendees"
                      className={labelClass}
                    >
                      Expected Attendees *
                    </label>
                    <input
                      id="attendees"
                      name="attendees"
                      type="number"
                      min="1"
                      required
                      placeholder="e.g. 200"
                      value={form.attendees}
                      onChange={(e) =>
                        updateField("attendees", e.target.value)
                      }
                      className={fieldClass}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              {/* Contact details */}
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/[0.08] text-sm font-semibold text-amber-200">
                    02
                  </span>
                  <div>
                    <h3 className="font-playfair text-xl font-semibold">
                      Contact Information
                    </h3>
                    <p className="mt-1 text-xs text-white/45">
                      How can our team reach you?
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="name"
                      className={labelClass}
                    >
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      minLength={2}
                      maxLength={100}
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={(e) =>
                        updateField("name", e.target.value)
                      }
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className={labelClass}
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) =>
                        updateField("email", e.target.value)
                      }
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="mobile"
                      className={labelClass}
                    >
                      Mobile Number *
                    </label>
                    <div className="flex gap-2">
                      <span className="flex items-center rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white/65">
                        +91
                      </span>
                      <input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        autoComplete="tel-national"
                        inputMode="numeric"
                        required
                        maxLength={10}
                        pattern="[0-9]{10}"
                        title="Enter a 10-digit Indian mobile number"
                        placeholder="10-digit number"
                        value={form.mobile}
                        onChange={(e) =>
                          updateField(
                            "mobile",
                            e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10)
                          )
                        }
                        className={fieldClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              {/* Additional requirements */}
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 text-sm font-semibold text-purple-200">
                    03
                  </span>
                  <div>
                    <h3 className="font-playfair text-xl font-semibold">
                      Additional Requirements
                    </h3>
                    <p className="mt-1 text-xs text-white/45">
                      Share any special requests with us.
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className={labelClass}
                  >
                    Tell Us More{" "}
                    <span className="text-white/40">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    maxLength={2000}
                    placeholder="Describe your event, preferred artist, performance duration, or any special requirements..."
                    value={form.message}
                    onChange={(e) =>
                      updateField("message", e.target.value)
                    }
                    className={`${fieldClass} resize-y`}
                  />
                  <p className="mt-2 text-right text-xs text-white/35">
                    {form.message.length}/2000
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-400/20 bg-red-400/[0.07] px-4 py-3 text-sm text-red-200"
                >
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-purple-950/30 transition duration-200 hover:from-purple-500 hover:to-purple-400 hover:shadow-purple-700/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="3"
                        opacity="0.25"
                      />
                      <path
                        d="M21 12a9 9 0 0 0-9-9"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    Submitting Enquiry...
                  </>
                ) : (
                  <>
                    Submit Event Enquiry
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-5 text-white/40">
                By submitting this form, you agree to be contacted
                by ArtistManch regarding your event requirements.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
