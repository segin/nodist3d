
from playwright.sync_api import sync_playwright, expect

def test_scene_graph_accessibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # 1. Navigate to app
            page.goto("http://localhost:3000")

            # Wait for initialization
            page.wait_for_selector("#scene-graph")

            # 2. Add an object to populate scene graph (using Dat.GUI simulation or JS)
            # We can use JS to call the method directly if exposed, or interact with GUI.
            # The GUI is Dat.GUI. It's usually Canvas or DOM based.
            # Let's try to find "Add Box" in the GUI.

            # Dat.GUI usually creates list items with text.
            # "Add Primitives" folder might be closed or open.
            # Let's use internal API via window if possible, or just click buttons if visible.
            # But simpler: check the initial state or empty state.

            # Initial state: "No objects in scene".
            # Is the UL existing?
            ul = page.locator("#scene-graph ul")
            expect(ul).to_have_attribute("role", "listbox")
            expect(ul).to_have_attribute("aria-label", "Scene Graph Objects")

            print("Verified role='listbox' and aria-label on empty list.")

            # 3. Add an object via console execution
            page.evaluate("window.app_instance = new (function() { return { addBox: () => {} }; })()") # Mock? No app is not global.
            # We cannot easily access app instance unless attached to window.
            # However, Dat.GUI adds elements to DOM.

            # Try to find "Add Box" text.
            # Dat.GUI renders text.
            # It's in .dg .c .property-name

            # Let's take a screenshot of the initial empty state which shows the panel.
            page.screenshot(path="verification/verification.png")
            print("Screenshot taken.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    test_scene_graph_accessibility()
