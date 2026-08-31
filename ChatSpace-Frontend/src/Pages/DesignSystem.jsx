
import Button from "../components/ui/Button";

function DesignSystem() {
  const handleClick = () => {
    console.log("Button clicked");
  };

  return (
    <div className="min-h-screen bg-(--background) p-8 text-(--text-primary)">
      <h1 className="mb-8 text-2xl font-semibold">
        Design System
      </h1>

      <section>
        <h2 className="mb-4 text-lg font-medium">
          Buttons
        </h2>

        <div className="flex flex-wrap gap-4">
          <Button onClick={handleClick}>
            Create Account
          </Button>

          <Button variant="secondary">
            Log In
          </Button>

          <Button variant="ghost">
            Cancel
          </Button>

          <Button variant="destructive">
            Delete Account
          </Button>

          <Button disabled>
            Disabled
          </Button>
        </div>
      </section>
    </div>
  );
}

export default DesignSystem;