import { usePalette } from 'src/app/lib/Palette';
import { useCss } from '../../lib/Css';
import { useSvg } from '../../lib/Svg';

const [palette] = usePalette();

const [css] = useCss({
  whiteFill: [['fill', palette('white')]],
  whiteStroke: [['stroke', palette('white')]],
  text: [
    ['fontSize', '10px'],
    ['color', palette('white')],
  ],
});

type Point = [number, number];

export const Transformer = {
  move(points: Point[], xOffset: number, yOffset: number): Point[] {
    return points.map(([x, y]) => [x + xOffset, y + yOffset]);
  },
  polarToCartesian(cx: number, cy: number, diameter: number, deg: number): Point {
    const radius = diameter / 2;
    var radian = ((deg - 90) * Math.PI) / 180.0;
    return [cx + radius * Math.cos(radian), cy + radius * Math.sin(radian)];
  },
  resize(points: Point[], scale: number): Point[] {
    const [p1x, p1y] = points[0];
    const [xOffset, yOffset] = [p1x * scale, p1y * scale];
    return points.map((point) => [point[0] * scale + xOffset, point[1] * scale + yOffset]);
  },
  rotate(points: Point[], angle: number): Point[] {
    const [cx, cy] = points[0];
    return points.map(([x, y]) => {
      const radians = (Math.PI / 180) * -angle;
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);
      const nx = cos * (x - cx) + sin * (y - cy) + cx;
      const ny = cos * (y - cy) - sin * (x - cx) + cy;
      return [nx, ny];
    });
  },
};

export const Renderer = {
  circle([x, y]: Point, fill: CSSStyleDeclaration['fill']) {
    const [circle] = useSvg('circle', ['cx', x], ['cy', y], ['r', 2], ['class', css('whiteFill')]);
    return circle();
  },
  polyline(
    points: Point[],
    stroke: CSSStyleDeclaration['stroke'],
    strokeWidth: CSSStyleDeclaration['strokeWidth'],
    fill: CSSStyleDeclaration['fill'],
    close: boolean = true,
  ) {
    const closingPoint = close ? `${points[0][0]},${points[0][1]}` : null;
    const [polygon] = useSvg(
      'polygon',
      ['points', `${points.map(([x, y]) => `${x},${y}`).join(' ')} ${closingPoint}`],
      ['style', `stroke:${stroke};fill:${fill};stroke-width:${strokeWidth};stroke-line-cap:round`],
    );
    return polygon();
  },
  text([x, y]: Point, txt: string) {
    const [text] = useSvg('text', ['x', x], ['y', y], ['class', css('text')]);
    return text(txt);
  },
};

interface BezierProps {
  p1: [number, number];
  p2: [number, number];
  p3: [number, number];
  p4: [number, number];
  pointFrequency: number;
  stroke: CSSStyleDeclaration['stroke'];
}

export class Bezier {
  private p1: BezierProps['p1'];
  private p2: BezierProps['p2'];
  private p3: BezierProps['p3'];
  private p4: BezierProps['p4'];
  private pointFrequency: BezierProps['pointFrequency'] = 4;
  points: Point[] = [];
  private stroke: BezierProps['stroke'];
  private tIncrement: number;
  constructor(props: BezierProps) {
    // props
    this.p1 = props.p1;
    this.p2 = props.p2;
    this.p3 = props.p3;
    this.p4 = props.p4;
    this.pointFrequency = props.pointFrequency;
    this.stroke = props.stroke;
    this.tIncrement = 1 / props.pointFrequency;

    // bindings
    this.calcT = this.calcT.bind(this);
    this.calcCoordsAtT = this.calcCoordsAtT.bind(this);
    this.render = this.render.bind(this);

    // computed props
    // populate points (+1 to complete points)
    for (let i = 0; i < this.pointFrequency + 1; i++) {
      this.points.push(this.calcCoordsAtT(i * this.tIncrement));
    }
  }
  private calcT(t: number, x1: number, y1: number, x2: number, y2: number): [number, number] {
    const xOffset = x2 > x1 ? x2 : x1;
    const yOffset = y2 > y1 ? y2 : y1;
    const xT = x2 > x1 ? 1 - t : t;
    const yT = y2 > y1 ? 1 - t : t;
    const xDirection = x2 > x1 ? 1 : -1;
    const yDirection = y2 > y1 ? 1 : -1;
    const x = xOffset + xT * (x1 - x2) * xDirection;
    const y = yOffset + yT * (y1 - y2) * yDirection;
    return [x, y];
  }
  private calcCoordsAtT(t: number) {
    // see https://webglfundamentals.org/webgl/lessons/webgl-3d-geometry-lathe.html

    // The two lines that intersect p
    const q1 = this.calcT(t, this.p1[0], this.p1[1], this.p2[0], this.p2[1]);
    const q2 = this.calcT(t, this.p2[0], this.p2[1], this.p3[0], this.p3[1]);
    const q3 = this.calcT(t, this.p3[0], this.p3[1], this.p4[0], this.p4[1]);

    // The line that intersects q
    const r1 = this.calcT(t, q1[0], q1[1], q2[0], q2[1]);
    const r2 = this.calcT(t, q2[0], q2[1], q3[0], q3[1]);

    // The point on r
    return this.calcT(t, r1[0], r1[1], r2[0], r2[1]);
  }
  render(debug: boolean = true) {
    const circles = debug ? this.points.map((point) => Renderer.circle(point, this.stroke)) : null;
    const polyline = Renderer.polyline(this.points, this.stroke, this.fill, true);
    const [g] = useSvg('g');
    return g(...circles, polyline);
  }
}

interface MandalaProps {
  cx: number;
  cy: number;
  debug: boolean;
  diameter: number;
  fill: CSSStyleDeclaration['fill'];
  stroke: CSSStyleDeclaration['stroke'];
  strokeWidth: CSSStyleDeclaration['strokeWidth'];
  petals: {
    height: number;
    frequency: number;
    slope: number;
  }[];
  rotation: number;
  rotationSpeed: number;
  on?: {
    mouseover?: () => void;
    mouseleave?: () => void;
  };
}

interface PetalCalc {
  p1: Point;
  p2: Point;
  p3: Point;
  p4: Point;
  pointFrequency: number;
  angle: number;
}

const createContainer: () => SVGGElement = () => {
  const [g] = useSvg('g', ['style', 'pointer-events:none']);
  return g() as SVGGElement;
};

type MandalaState = 'INIT' | 'STATIC' | 'ANIMATING';
type MandalaEvent =
  | { event: 'ANIMATE' }
  | { event: 'INIT' }
  | { event: 'STOP' }
  | { event: 'ROTATE' }
  | { event: 'SET_PETAL'; numOfPetals: number };
export class Mandala {
  private cx: MandalaProps['cx'];
  private cy: MandalaProps['cy'];
  private debug: MandalaProps['debug'];
  private diameter: MandalaProps['diameter'];
  private fill: MandalaProps['fill'];
  private petals: MandalaProps['petals'];
  private stroke: MandalaProps['stroke'];
  private strokeWidth: MandalaProps['strokeWidth'];
  private rotation: MandalaProps['rotation'] = 0;
  private rotationSpeed: MandalaProps['rotationSpeed'] = 0.3;
  private on: MandalaProps['on'];
  private petalCalcs: PetalCalc[] = [];
  private state: MandalaState = 'INIT';
  private el: SVGGElement = createContainer();
  constructor(props: MandalaProps) {
    this.cx = props.cx;
    this.cy = props.cy;
    this.debug = props.debug;
    this.diameter = props.diameter;
    this.fill = props.fill;
    this.petals = props.petals;
    this.stroke = props.stroke;
    this.strokeWidth = props.strokeWidth;
    this.petals = props.petals;
    this.rotation = props.rotation;
    this.rotationSpeed = props.rotationSpeed;
    this.on = props.on;
    this.msg({ event: 'INIT' });
  }
  msg(event: MandalaEvent) {
    // state based
    switch (this.state) {
      case 'INIT':
        switch (event.event) {
          case 'INIT':
            this.state = 'STATIC';
            this.calcPetals().render().registerEvents();
            break;
        }
      case 'STATIC':
        switch (event.event) {
          case 'ANIMATE':
            this.state = 'ANIMATING';
            this.animate();
            break;
        }
      case 'ANIMATING':
        switch (event.event) {
          case 'STOP':
            this.state = 'STATIC';
            break;
          case 'ROTATE':
            this.calcPetals().render().registerEvents();
            break;
        }
    }
  }
  private calcPetals() {
    const calcs: PetalCalc[] = [];
    const angle = 360 / this.petals.length;
    const startingAngle = angle / 2;
    this.petals.forEach((petal, i) => {
      const petalAngle = angle * i + this.rotation;
      const nextAngle = angle * (i + 1) + this.rotation;
      const [x, y] = Transformer.polarToCartesian(this.cx, this.cy, this.diameter, petalAngle);
      const [nx, ny] = Transformer.polarToCartesian(this.cx, this.cy, this.diameter, nextAngle);
      const width = Math.hypot(nx - x, ny - y);
      const [p1, p2, p3, p4] = Transformer.rotate(
        Transformer.move(
          [
            [0, 0],
            [width * petal.slope, petal.height],
            [width - width * petal.slope, petal.height],
            [width, 0],
          ],
          x,
          y,
        ),
        petalAngle + startingAngle,
      );
      calcs.push({ p1, p2, p3, p4, pointFrequency: petal.frequency, angle: petalAngle });
    });
    this.petalCalcs = calcs;
    return this;
  }
  private registerEvents() {
    if (this.on?.mouseover) this.el.addEventListener('mouseenter', this.on.mouseover);
    if (this.on?.mouseleave && document.body) document.body.addEventListener('mouseout', this.on.mouseleave);
    if (this.on?.mouseleave && document.body) document.body.addEventListener('mouseleave', this.on.mouseleave);
    return this;
  }
  private render() {
    this.el.innerHTML = '';
    if (this.on?.mouseover) {
      this.el.style.pointerEvents = 'auto';
      this.el.style.cursor = 'pointer';
    }

    const isPlaying = (angle: number) => angle % 360 >= 0 && angle % 360 <= 360 / (360 / this.rotationSpeed);

    const texts = this.petalCalcs.map((p) =>
      Renderer.text([p.p1[0] - 20, p.p1[1] - 10], `${(p.angle % 360).toFixed(0)}`),
    );
    const circles = this.petalCalcs.map((p) =>
      Renderer.circle(p.p1, isPlaying(p.angle) ? palette('white') : this.stroke),
    );
    const polyline = Renderer.polyline(
      this.petalCalcs
        .map(
          ({ p1, p2, p3, p4, pointFrequency, angle }) =>
            new Bezier({ p1, p2, p3, p4, pointFrequency, stroke: this.stroke }).points,
        )
        .flat(1),
      this.stroke,
      this.strokeWidth,
      this.fill,
      true,
    );
    if (this.debug) circles.forEach((circle) => this.el.appendChild(circle));
    if (this.debug) texts.forEach((text) => this.el.appendChild(text));
    this.el.appendChild(polyline);
    return this;
  }
  private animate() {
    const step = () => {
      this.rotation += this.rotationSpeed; // should rerender
      if (this.state === 'ANIMATING') {
        this.msg({ event: 'ROTATE' });
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
}

export const useMandala = (props: MandalaProps): [any, (event: MandalaEvent) => void] => {
  const mandala = new Mandala(props);
  return [mandala.el, mandala.msg.bind(mandala)];
};
