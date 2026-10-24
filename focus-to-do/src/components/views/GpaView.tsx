import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Course } from '../../types';

interface GpaViewProps {
  courses: Course[];
  onOpenNewCourse: () => void;
  onDeleteCourse: (courseId: number) => void;
}

export const GpaView: React.FC<GpaViewProps> = ({
  courses,
  onOpenNewCourse,
  onDeleteCourse
}) => {
  let totalGpt = 0;
  let totalCredits = 0;
  courses.forEach((c) => {
    totalGpt += c.gpt || 0;
    totalCredits += c.credits || 0;
  });
  const cgpa = totalCredits > 0 ? (totalGpt / totalCredits).toFixed(2) : '0.00';

  return (
    <section className="space-y-4 animate-in fade-in duration-150">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">🎓 GPA Tracker</h2>
        <p className="text-xs text-[var(--text-2)] mt-0.5">Continuous assessment + final exam grading</p>
      </div>

      {/* CGPA Summary Card */}
      <div className="p-5 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)]">
            Cumulative GPA
          </p>
          <p className="text-4xl font-extrabold tracking-tight text-[var(--primary)] mt-1 tabular leading-tight">
            {cgpa}
          </p>
          <p className="text-xs text-[var(--text-2)] mt-0.5">
            {totalCredits} credit hours · {courses.length} course{courses.length === 1 ? '' : 's'}
          </p>
        </div>

        <button
          onClick={onOpenNewCourse}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text)] transition shadow-2xs active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Course</span>
        </button>
      </div>

      {/* Course List */}
      {courses.length > 0 ? (
        <div className="flex flex-col gap-2">
          {courses.map((course) => {
            const isFailing = course.letter === 'F';
            return (
              <div
                key={course.id}
                className="p-3.5 rounded-md border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-[13.5px] font-bold text-[var(--text)] truncate">
                    {course.title}
                  </p>
                  <p className="text-xs text-[var(--text-2)] mt-0.5 tabular">
                    {course.credits} cr · {course.continuous}/50 + {course.finalExam}/50 ={' '}
                    <strong className="text-[var(--text)] font-semibold">{course.totalMark}%</strong>
                  </p>
                  <p
                    className={`text-[11px] font-semibold mt-0.5 ${
                      isFailing ? 'text-[var(--danger)]' : 'text-[var(--primary)]'
                    }`}
                  >
                    {course.status}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-[var(--primary)] leading-none">
                      {course.letter}
                    </p>
                    <p className="text-[10px] text-[var(--text-2)] tabular mt-0.5">
                      {course.vlg.toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => onDeleteCourse(course.id)}
                    title="Remove course"
                    className="w-7 h-7 rounded flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--hover)] hover:text-[var(--danger)] transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-10 rounded-md border border-dashed border-[var(--border)] text-center bg-[var(--surface)]">
          <div className="text-4xl mb-2.5">🎓</div>
          <p className="text-sm font-semibold text-[var(--text)]">No courses yet</p>
          <p className="text-xs text-[var(--text-3)] mt-1">
            Tap &quot;Course&quot; to pick Ethiopian curriculum presets or add your own subjects.
          </p>
        </div>
      )}
    </section>
  );
};
