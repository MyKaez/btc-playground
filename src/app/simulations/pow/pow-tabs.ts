export enum PowTabs {
    Definition,
    Simulation,
    Calculator
}

export const PowTabParamMapping: Record<string, PowTabs> = {
    "def": PowTabs.Definition,
    "sim": PowTabs.Simulation,
    "calc": PowTabs.Calculator
}